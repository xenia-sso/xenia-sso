import { Middleware, Req, Res, Next, Context } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { AccessTokenMiddleware } from "./utils/access-token";

@Middleware()
export class AccessTokenQueryMiddleware extends AccessTokenMiddleware {
  async use(@Context() ctx: Context, @Req() req: Req, @Res() res: Res, @Next() next: Next) {
    const { user, token, client } = await this.getUserFromToken(req.query.token?.toString());

    if (client.id !== ctx.get("client").id) {
      throw new Forbidden("Forbidden");
    }

    ctx.set("user", user);
    ctx.set("token", token);
    next();
  }
}
