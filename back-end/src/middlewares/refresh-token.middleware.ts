import { Middleware, Req, Context } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import jwt, { JwtPayload } from "jsonwebtoken";
import { users } from "src/data/sample";

@Middleware()
export class RefreshTokenMiddleware {
  use(@Req() req: Req, @Context() ctx: Context) {
    const token = req.cookies?.["sso_refresh_token"];
    if (!token) {
      throw new Unauthorized("Unauthorized");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY) as JwtPayload;
    } catch {
      throw new Unauthorized("Unauthorized");
    }

    if (!decoded.refresh) {
      throw new Unauthorized("Unauthorized");
    }

    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      throw new Unauthorized("Unauthorized");
    }

    ctx.set("user", user);
  }
}
