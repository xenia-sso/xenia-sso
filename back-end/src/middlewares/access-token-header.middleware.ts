import { Middleware, Req, Res, Next, Context } from "@tsed/common";
import { AccessTokenMiddleware } from "./utils/access-token";

@Middleware()
export class AccessTokenHeaderMiddleware extends AccessTokenMiddleware {
  async use(@Context() ctx: Context, @Req() req: Req, @Res() res: Res, @Next() next: Next) {
    const { user, token } = await this.getUserFromToken(req.headers.authorization);

    ctx.set("user", user);
    ctx.set("token", token);
    next();
  }
}
