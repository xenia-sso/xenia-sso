import { Context, Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { ContentType, Delete } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { UsersRepository } from "src/services/users.repository";

@Controller("/admin/users")
@ContentType("application/json")
@UseAuth(AuthMiddleware, { role: "admin" })
export class UsersController {
  @Inject(UsersRepository) private repository: UsersRepository;

  @Get("/")
  async getAll() {
    return this.repository.getAll();
  }

  @Delete("/:id")
  delete(@Context() ctx: Context, @PathParams("id") id: string) {
    if (ctx.get("user").id === id) {
      throw new Forbidden("Forbidden");
    }
    return this.repository.delete(id);
  }
}
