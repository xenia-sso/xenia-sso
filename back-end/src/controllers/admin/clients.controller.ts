import { BodyParams, Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { ContentType, Delete, Post } from "@tsed/schema";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { ClientModel } from "../../models/client.model";
import { ClientsRepository } from "../../services/clients.repository";

@Controller("/admin/clients")
@ContentType("application/json")
@UseAuth(AuthMiddleware, { role: "admin" })
export class ClientsController {
  @Inject(ClientsRepository) private repository: ClientsRepository;

  @Get("/")
  get() {
    return this.repository.getAll();
  }

  @Post("/")
  create(@BodyParams() body: ClientModel) {
    return this.repository.create(body);
  }

  @Delete("/:id")
  delete(@PathParams("id") id: string) {
    return this.repository.delete(id);
  }
}
