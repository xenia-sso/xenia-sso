import { Controller, Get, UseAuth, UseBefore, Context, Req, Res, BodyParams, Inject } from "@tsed/common";
import { ContentType, Email, MaxLength, MinLength, Post, Put, Required } from "@tsed/schema";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RefreshTokenMiddleware } from "../middlewares/refresh-token.middleware";
import jwt from "jsonwebtoken";
import { BadRequest, Forbidden, Unauthorized } from "@tsed/exceptions";
import { UsersRepository } from "../services/users.repository";
import { InvitationCodesRepository } from "../services/invitation-codes.repository";
import { DateTime } from "luxon";
import { ClientsRepository } from "../services/clients.repository";
import { InitializedMiddleware } from "../middlewares/initialized.middleware";

class AuthenticateBody {
  @Required()
  @Email()
  email: string;

  @Required()
  password: string;
}

class RegisterBody {
  @Required()
  invitationCode: string;

  @Required()
  @MaxLength(100)
  @Email()
  email: string;

  @Required()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @Required()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @Required()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;
}

class ChangePasswordBody {
  @Required()
  @MinLength(6)
  @MaxLength(100)
  oldPassword: string;

  @Required()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;
}

@Controller("/auth")
@ContentType("application/json")
@UseBefore(InitializedMiddleware)
export class AuthController {
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;
  @Inject(InvitationCodesRepository) private invitationCodesRepository: InvitationCodesRepository;

  @Get("/user")
  @UseAuth(AuthMiddleware)
  getUser(@Context() ctx: Context) {
    return ctx.get("user");
  }

  @Post("/register")
  async register(@BodyParams() body: RegisterBody) {
    const matchingInvitationCode = await this.invitationCodesRepository.findByCode(body.invitationCode);
    if (!matchingInvitationCode) {
      throw new Forbidden("Forbidden");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { invitationCode, ...userPayload } = body;
    try {
      const user = await this.usersRepository.create(userPayload);
      await this.invitationCodesRepository.deleteByCode(body.invitationCode);
      for (const clientId of matchingInvitationCode.clients) {
        await this.clientsRepository.addUserToGrantedUsers(clientId.toString(), user.id);
      }
      return user;
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      throw new BadRequest("EMAIL_ALREADY_EXISTS");
    }
  }

  @Post("/login")
  async login(@Res() res: Res, @BodyParams() body: AuthenticateBody) {
    const user = await this.usersRepository.checkPassword(body.email, body.password);
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
        expires: DateTime.now().plus({ days: 90 }).toJSDate(),
      }
    );

    return {
      token: jwt.sign({ userId: user.id, refresh: false }, process.env.JWT_KEY, {
        expiresIn: "15 min",
      }),
      user,
    };
  }

  @UseAuth(AuthMiddleware)
  @Put("/change-password")
  async changePassword(@Context() ctx: Context, @BodyParams() body: ChangePasswordBody) {
    if (!(await this.usersRepository.checkPassword(ctx.get("user").email, body.oldPassword))) {
      throw new Unauthorized("Unauthorized");
    }
    await this.usersRepository.updatePassword(ctx.get("user").id, body.newPassword);
    return { success: true };
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

  @Post("/logout")
  @UseAuth(AuthMiddleware)
  async logout(@Res() res: Res) {
    res.clearCookie("sso_refresh_token");
    return { success: true };
  }
}
