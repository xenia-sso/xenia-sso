import { Controller, Get, UseAuth, UseBefore, Context, Req, Res, BodyParams, Inject } from "@tsed/common";
import { ContentType, Email, Post, Required } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { RefreshTokenMiddleware } from "src/middlewares/refresh-token.middleware";
import jwt from "jsonwebtoken";
import { Unauthorized } from "@tsed/exceptions";
import { UsersRepository } from "src/services/users.repository";

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
  @Inject(UsersRepository) private repository: UsersRepository;

  @Get("/user")
  @UseAuth(AuthMiddleware)
  getUser(@Context() ctx: Context) {
    console.log(ctx.get("user"));
    return ctx.get("user");
  }

  @Post("/login")
  async login(@Res() res: Res, @BodyParams() body: AuthenticateBody) {
    const user = await this.repository.checkPassword(body.email, body.password);
    if (!user) {
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
