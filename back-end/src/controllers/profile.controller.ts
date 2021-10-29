import { BodyParams, Context, Controller, Inject, UseAuth } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { ContentType, Delete, Email, MaxLength, MinLength, Put, Required } from "@tsed/schema";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UsersRepository } from "../services/users.repository";

class EditProfileBody {
  @Required()
  @Email()
  @MaxLength(100)
  email: string;

  @Required()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @Required()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;
}

class DeleteAccountPayload {
  @Required()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}

@Controller("/profile")
@ContentType("application/json")
@UseAuth(AuthMiddleware)
export class ProfileController {
  @Inject(UsersRepository) private repository: UsersRepository;

  @Put("/")
  update(@Context() ctx: Context, @BodyParams() body: EditProfileBody) {
    return this.repository.update(ctx.get("user").id, body);
  }

  @Delete("/")
  async delete(@Context() ctx: Context, @BodyParams() body: DeleteAccountPayload) {
    const user = ctx.get("user");
    if (!(await this.repository.checkPassword(user.email, body.password))) {
      throw new Unauthorized("Unauthorized");
    }

    if (user.roles.includes("admin") && (await this.repository.isLastAdmin(user.id))) {
      throw new Forbidden("Forbidden");
    }

    return this.repository.delete(user.id);
  }
}
