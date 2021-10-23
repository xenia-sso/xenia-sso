import { Middleware, Req, Context, Inject } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UsersRepository } from "src/services/users.repository";

@Middleware()
export class RefreshTokenMiddleware {
  @Inject(UsersRepository) private repository: UsersRepository;

  async use(@Req() req: Req, @Context() ctx: Context) {
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

    const user = await this.repository.findById(decoded.userId);
    if (!user) {
      throw new Unauthorized("Unauthorized");
    }

    ctx.set("user", user);
  }
}
