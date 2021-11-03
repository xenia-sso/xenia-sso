import { BodyParams, Context, Controller, Inject, Post, QueryParams, UseAuth } from "@tsed/common";
import { Forbidden, InternalServerError, NotFound, Unauthorized } from "@tsed/exceptions";
import { ObjectID } from "@tsed/mongoose";
import { ContentType, Enum, MaxLength, MinLength, Required } from "@tsed/schema";
import { DateTime } from "luxon";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ClientMiddleware } from "../middlewares/client.middleware";
import { AuthorizationCodesRepository } from "../services/authorization-codes.repository";
import { ClientsRepository } from "../services/clients.repository";
import { createHash } from "crypto";
import { UsersRepository } from "../services/users.repository";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { generate } from "randomstring";
import { generateIdToken } from "../utils/openid";

class AuthorizeBody {
  @Required()
  @ObjectID()
  clientId: string;

  @Required()
  @Enum("openid")
  scope: "openid";

  @Required()
  @Enum("code")
  responseType: "code";

  @Required()
  @MinLength(2)
  @MaxLength(100)
  codeChallenge: string;

  @Required()
  @Enum("S256")
  codeChallengeMethod: "S256";
}

class GetAccessTokenQuery {
  @Required()
  @Enum("authorization_code")
  grant_type: string;

  @Required()
  code_verifier: string;

  @Required()
  code: string;
}

class IntrospectQuery {
  @Required()
  token: string;
}

@Controller("/oauth2")
@ContentType("application/json")
@UseAuth(AuthMiddleware)
export class Oauth2Controller {
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;
  @Inject(AuthorizationCodesRepository) private authCodesRepository: AuthorizationCodesRepository;
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;

  @Post("/authorize")
  async authorize(@Context() ctx: Context, @BodyParams() body: AuthorizeBody) {
    const user = ctx.get("user");
    const client = await this.clientsRepository.findById(body.clientId);
    if (!client) {
      throw new NotFound("Client not found");
    }
    if (!client.allUsers && !client.grantedUsers.includes(user.id)) {
      throw new Forbidden("Forbidden");
    }

    const authCode = await this.authCodesRepository.create({ ...body, userId: user.id });

    return { authorizationCode: authCode.id };
  }

  @UseAuth(ClientMiddleware)
  @Post("/token")
  async getAccessToken(@Context() ctx: Context, @QueryParams() query: GetAccessTokenQuery) {
    const client = ctx.get("client");
    const authCode = await this.authCodesRepository.findAndDelete(query.code, client.id);
    if (!authCode) {
      throw new NotFound("Authorization code not found");
    }
    const user = await this.usersRepository.findById(authCode.userId.toString());
    if (!user) {
      throw new NotFound("User not found");
    }
    if (!client.allUsers && !client.grantedUsers.includes(authCode.userId)) {
      throw new Forbidden("Forbidden");
    }
    if (DateTime.now() > DateTime.fromJSDate(authCode.expiration)) {
      throw new Unauthorized("Expired authorization code");
    }
    if (authCode.codeChallengeMethod !== "S256") {
      throw new InternalServerError("Unhandled code challenge method");
    }
    const hash = createHash("sha256")
      .update(query.code_verifier)
      .digest("base64")
      .toString()
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (hash !== authCode.codeChallenge) {
      throw new Unauthorized("Code challenge mismatch");
    }

    const token = generate({ length: 128 });
    await this.accessTokensRepository.create({
      clientId: client.id,
      userId: user.id,
      lastUsed: DateTime.now().toJSDate(),
      token,
    });

    return {
      token_type: "Bearer",
      access_token: token,
      scope: "openid",
      id_token: generateIdToken(user),
    };
  }

  @UseAuth(ClientMiddleware)
  @Post("/introspect")
  async introspect(@Context() ctx: Context, @QueryParams() query: IntrospectQuery) {
    const { active } = await this.accessTokensRepository.isAccessTokenActive(query.token, ctx.get("client").id);
    if (!active) {
      await this.accessTokensRepository.deleteByToken(query.token);
    }
    return { active };
  }
}
