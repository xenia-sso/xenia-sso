import { BodyParams, Context, Controller, Inject, Post, UseAuth } from "@tsed/common";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { ObjectID } from "@tsed/mongoose";
import { ContentType, Enum, MaxLength, MinLength, Required } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { AuthorizationCodesRepository } from "src/services/authorization-codes.repository";
import { ClientsRepository } from "src/services/clients.repository";

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

@Controller("/oauth2")
@ContentType("application/json")
@UseAuth(AuthMiddleware)
export class Oauth2Controller {
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;
  @Inject(AuthorizationCodesRepository) private authCodesRepository: AuthorizationCodesRepository;

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
}
