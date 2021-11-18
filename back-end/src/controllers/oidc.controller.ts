import { Context, Controller, Get, Inject, QueryParams, UseAuth } from "@tsed/common";
import { ContentType, Required } from "@tsed/schema";
import { AccessTokenMiddleware } from "../middlewares/access-token.middleware";
import { ClientMiddleware } from "../middlewares/client.middleware";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { generateIdToken } from "../utils/openid";

class UserinfoQuery {
  @Required()
  token: string;
}

@Controller("/oidc")
@ContentType("application/json")
export class UserinfoController {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;

  @UseAuth(ClientMiddleware)
  @UseAuth(AccessTokenMiddleware)
  @Get("/userinfo")
  async userinfo(@Context() ctx: Context, @QueryParams() query: UserinfoQuery) {
    await this.accessTokensRepository.updateAccessTokenLastUsed(query.token);
    return {
      id_token: generateIdToken(ctx.get("user")),
    };
  }
}
