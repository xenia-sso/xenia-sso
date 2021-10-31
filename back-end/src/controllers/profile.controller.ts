import { BodyParams, Context, Controller, Inject, UseAuth } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { ContentType, Delete, Email, Get, MaxLength, MinLength, Put, Required } from "@tsed/schema";
import { ClientsRepository } from "src/services/clients.repository";
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
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  @Put("/")
  update(@Context() ctx: Context, @BodyParams() body: EditProfileBody) {
    return this.usersRepository.update(ctx.get("user").id, body);
  }

  @Get("/my-apps")
  async getMyApps(@Context() ctx: Context) {
    const user = ctx.get("user");
    const allClients = await this.clientsRepository.getAll();
    return allClients.filter((c) => {
      if (c.allUsers) {
        return true;
      }
      return c.grantedUsers.includes(user.id);
    });
  }

  @Delete("/")
  async delete(@Context() ctx: Context, @BodyParams() body: DeleteAccountPayload) {
    const user = ctx.get("user");
    if (!(await this.usersRepository.checkPassword(user.email, body.password))) {
      throw new Unauthorized("Unauthorized");
    }

    if (user.roles.includes("admin") && (await this.usersRepository.isLastAdmin(user.id))) {
      throw new Forbidden("Forbidden");
    }

    return this.usersRepository.delete(user.id);
  }
}
