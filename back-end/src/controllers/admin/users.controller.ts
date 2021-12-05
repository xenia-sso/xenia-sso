import { BodyParams, Context, Controller, Get, Inject, PathParams, UseAuth, UseBefore } from "@tsed/common";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { ContentType, Delete, Put, Required } from "@tsed/schema";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { InitializedMiddleware } from "../../middlewares/initialized.middleware";
import { AccessTokensRepository } from "../../services/access-tokens.repository";
import { AuthorizationCodesRepository } from "../../services/authorization-codes.repository";
import { ClientsRepository } from "../../services/clients.repository";
import { UsersRepository } from "../../services/users.repository";

class SetAdminBody {
  @Required()
  value: boolean;
}

@Controller("/admin/users")
@ContentType("application/json")
@UseAuth(AuthMiddleware, { role: "admin" })
@UseBefore(InitializedMiddleware)
export class UsersController {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(AuthorizationCodesRepository) private authorizationCodesRepository: AuthorizationCodesRepository;
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  @Get("/")
  async getAll() {
    return this.usersRepository.getAll();
  }

  @Put("/set-admin/:id")
  async setAdmin(@Context() ctx: Context, @PathParams("id") id: string, @BodyParams() body: SetAdminBody) {
    if (ctx.get("user").id === id) {
      throw new Forbidden("Forbidden");
    }
    return this.usersRepository.setAdmin(id, body.value);
  }

  @Delete("/:id")
  async delete(@Context() ctx: Context, @PathParams("id") id: string) {
    if (ctx.get("user").id === id) {
      throw new Forbidden("Forbidden");
    }
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFound("NotFound");
    }
    await this.accessTokensRepository.deleteByUser(user.id);
    await this.authorizationCodesRepository.deleteByUser(user.id);
    await this.clientsRepository.removeUserFromGrantedUsers(user.id);
    return this.usersRepository.delete(user.id);
  }
}
