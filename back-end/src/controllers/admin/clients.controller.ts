import { BodyParams, Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { ContentType, Delete, Post, Put } from "@tsed/schema";
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

  @Put("/:id")
  edit(@PathParams("id") id: string, @BodyParams() body: ClientModel) {
    return this.repository.update(id, body);
  }

  @Put("/secret/:id")
  resetSecret(@PathParams("id") id: string) {
    return this.repository.resetSecret(id);
  }

  @Delete("/:id")
  delete(@PathParams("id") id: string) {
    return this.repository.delete(id);
  }
}
