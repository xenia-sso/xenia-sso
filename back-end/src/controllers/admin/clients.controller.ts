import { BodyParams, Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { ContentType, Delete, Post, Put } from "@tsed/schema";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { ClientModel } from "../../models/client.model";
import { ClientsRepository } from "../../services/clients.repository";
import { InvitationCodesRepository } from "../../services/invitation-codes.repository";

@Controller("/admin/clients")
@ContentType("application/json")
@UseAuth(AuthMiddleware, { role: "admin" })
export class ClientsController {
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;
  @Inject(InvitationCodesRepository) private invitationCodesRepository: InvitationCodesRepository;

  @Get("/")
  get() {
    return this.clientsRepository.getAll();
  }

  @Post("/")
  create(@BodyParams() body: ClientModel) {
    return this.clientsRepository.create(body);
  }

  @Put("/:id")
  edit(@PathParams("id") id: string, @BodyParams() body: ClientModel) {
    return this.clientsRepository.update(id, body);
  }

  @Put("/secret/:id")
  resetSecret(@PathParams("id") id: string) {
    return this.clientsRepository.resetSecret(id);
  }

  @Delete("/:id")
  async delete(@PathParams("id") id: string) {
    await this.invitationCodesRepository.removeClientFromAllInvitationCodes(id);
    return this.clientsRepository.delete(id);
  }
}
