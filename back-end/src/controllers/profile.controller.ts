import { BodyParams, Context, Controller, Inject, UseAuth } from "@tsed/common";
import { ContentType, Email, MaxLength, MinLength, Put, Required } from "@tsed/schema";
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

@Controller("/profile")
@ContentType("application/json")
@UseAuth(AuthMiddleware)
export class ProfileController {
  @Inject(UsersRepository) private repository: UsersRepository;

  @Put("/")
  get(@Context() ctx: Context, @BodyParams() body: EditProfileBody) {
    return this.repository.update(ctx.get("user").id, body);
  }
}
