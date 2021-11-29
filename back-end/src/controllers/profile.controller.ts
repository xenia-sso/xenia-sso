import { BodyParams, Context, Controller, Inject, UseAuth } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { ContentType, Delete, Email, Get, MaxLength, MinLength, Put, Required } from "@tsed/schema";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { AuthorizationCodesRepository } from "../services/authorization-codes.repository";
import { ClientsRepository } from "../services/clients.repository";
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

class DeleteAccountBody {
  @Required()
  password: string;
}

@Controller("/profile")
@ContentType("application/json")
@UseAuth(AuthMiddleware)
export class ProfileController {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(AuthorizationCodesRepository) private authorizationCodesRepository: AuthorizationCodesRepository;
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
  async delete(@Context() ctx: Context, @BodyParams() body: DeleteAccountBody) {
    const user = ctx.get("user");
    if (!(await this.usersRepository.checkPassword(user.email, body.password))) {
      throw new Unauthorized("Unauthorized");
    }

    if (user.roles.includes("admin") && (await this.usersRepository.isLastAdmin(user.id))) {
      throw new Forbidden("Forbidden");
    }

    await this.accessTokensRepository.deleteByUser(user.id);
    await this.authorizationCodesRepository.deleteByUser(user.id);
    await this.clientsRepository.removeUserFromGrantedUsers(user.id);
    return this.usersRepository.delete(user.id);
  }
}
