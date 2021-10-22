import { Controller, Get, UseAuth, UseBefore, Context, Req, Res, BodyParams } from "@tsed/common";
import { ContentType, Email, Post, Required } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { RefreshTokenMiddleware } from "src/middlewares/refresh-token.middleware";
import jwt from "jsonwebtoken";
import { users } from "src/data/sample";
import { Unauthorized } from "@tsed/exceptions";

class AuthenticateBody {
  @Required()
  @Email()
  email: string;

  @Required()
  password: string;
}

@Controller("/auth")
@ContentType("application/json")
export class AuthController {
  @Get("/user")
  @UseAuth(AuthMiddleware)
  getUser(@Context() ctx: Context) {
    return ctx.get("user");
  }

  @Post("/login")
  authenticate(@Res() res: Res, @BodyParams() body: AuthenticateBody) {
    const user = users.find((u) => u.email === body.email);
    if (!user || user.password !== body.password) {
      throw new Unauthorized("Unauthorized");
    }

    res.cookie(
      "sso_refresh_token",
      jwt.sign({ userId: user.id, refresh: true }, process.env.JWT_KEY, {
        expiresIn: "90 days",
      }),
      {
        httpOnly: true,
        sameSite: true,
      }
    );

    return {
      token: jwt.sign({ userId: user.id, refresh: false }, process.env.JWT_KEY, {
        expiresIn: "15 min",
      }),
      user,
    };
  }

  @Post("/refresh")
  @UseBefore(RefreshTokenMiddleware)
  refreshToken(@Req() req: Req, @Context() ctx: Context) {
    const userId = ctx.get("user").id;

    return {
      token: jwt.sign({ userId, refresh: false }, process.env.JWT_KEY, {
        expiresIn: "15 min",
      }),
    };
  }
}
