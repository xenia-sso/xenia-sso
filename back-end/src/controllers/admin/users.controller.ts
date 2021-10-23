import { BodyParams, Controller, Get, Inject, UseAuth } from "@tsed/common";
import { ContentType, Post } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { UserModel } from "src/models/user.model";
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

  @Post("/")
  async create(@BodyParams() body: UserModel) {
    return this.repository.create(body);
  }
}
