import { BodyParams, Controller, Get, Inject } from "@tsed/common";
import { ContentType, Post } from "@tsed/schema";
import { UserModel } from "src/models/user.model";
import { UsersRepository } from "src/services/users.repository";

@Controller("/users")
@ContentType("application/json")
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
