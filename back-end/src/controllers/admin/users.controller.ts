import { Context, Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { ContentType, Delete } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { AccessTokensRepository } from "src/services/access-tokens.repository";
import { AuthorizationCodesRepository } from "src/services/authorization-codes.repository";
import { ClientsRepository } from "src/services/clients.repository";
import { UsersRepository } from "src/services/users.repository";

@Controller("/admin/users")
@ContentType("application/json")
@UseAuth(AuthMiddleware, { role: "admin" })
export class UsersController {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(AuthorizationCodesRepository) private authorizationCodesRepository: AuthorizationCodesRepository;
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  @Get("/")
  async getAll() {
    return this.usersRepository.getAll();
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
