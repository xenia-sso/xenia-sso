import { Context, Controller, Get, Inject, QueryParams, UseAuth } from "@tsed/common";
import { InternalServerError, NotFound, Unauthorized, Forbidden } from "@tsed/exceptions";
import { ContentType, Required } from "@tsed/schema";
import { ClientMiddleware } from "../middlewares/client.middleware";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { ClientsRepository } from "../services/clients.repository";
import { UsersRepository } from "../services/users.repository";
import { generateIdToken } from "../utils/openid";

class UserinfoQuery {
  @Required()
  token: string;
}

@Controller("/oidc")
@ContentType("application/json")
export class UserinfoController {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  @UseAuth(ClientMiddleware)
  @Get("/userinfo")
  async userinfo(@Context() ctx: Context, @QueryParams() params: UserinfoQuery) {
    const { active } = await this.accessTokensRepository.isAccessTokenActive(params.token, ctx.get("client").id);
    if (!active) {
      await this.accessTokensRepository.deleteByToken(params.token, ctx.get("client").id);
      throw new Unauthorized("Access token expired");
    }

    const token = await this.accessTokensRepository.getAccessTokenByToken(params.token);
    if (!token) {
      throw new InternalServerError("An unexpected error occurred");
    }

    const client = ctx.get("client");
    if (!this.clientsRepository.isUserGrantedToClient(token.userId.toString(), client)) {
      throw new Forbidden("Forbidden");
    }

    const user = await this.usersRepository.findById(token.userId.toString());
    if (!user) {
      throw new NotFound("User not found");
    }

    return {
      id_token: generateIdToken(user),
    };
  }
}
