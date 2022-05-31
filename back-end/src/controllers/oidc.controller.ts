import { Context, Controller, Get, Inject, UseAuth, UseBefore } from "@tsed/common";
import { InternalServerError } from "@tsed/exceptions";
import { ContentType } from "@tsed/schema";
import { AccessTokenHeaderMiddleware } from "../middlewares/access-token-header.middleware";
import { InitializedMiddleware } from "../middlewares/initialized.middleware";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { generateUserObj } from "../utils/openid";

@Controller("/oidc")
@ContentType("application/json")
@UseBefore(InitializedMiddleware)
export class UserinfoController {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;

  @UseAuth(AccessTokenHeaderMiddleware)
  @Get("/userinfo")
  async userinfo(@Context() ctx: Context) {
    const accessToken = await this.accessTokensRepository.updateAccessTokenLastUsed(ctx.get("token"));
    if (!accessToken) {
      throw new InternalServerError("Internal Server Error");
    }

    return generateUserObj(ctx.get("user"), accessToken.scope);
  }
}
