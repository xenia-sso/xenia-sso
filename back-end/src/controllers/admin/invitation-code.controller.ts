import { BodyParams, Controller, Get, Inject, PathParams, UseAuth, UseBefore } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";
import { CollectionOf, ContentType, Delete, Post, Put, Required } from "@tsed/schema";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { InitializedMiddleware } from "../../middlewares/initialized.middleware";
import { ClientsRepository } from "../../services/clients.repository";
import { InvitationCodesRepository } from "../../services/invitation-codes.repository";

class SetClientsBody {
  @Required()
  // eslint-disable-next-line prettier/prettier
  @CollectionOf(String)
  clients: string[] = [];
}

@Controller("/admin/invitation-codes")
@ContentType("application/json")
@UseAuth(AuthMiddleware, { role: "admin" })
@UseBefore(InitializedMiddleware)
export class InvitationCodesController {
  @Inject(InvitationCodesRepository) private invitationCodesRepository: InvitationCodesRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  @Get("/")
  getAll() {
    return this.invitationCodesRepository.getAll();
  }

  @Post("/")
  create() {
    return this.invitationCodesRepository.create();
  }

  @Put("/:id/clients")
  async setClients(@PathParams("id") id: string, @BodyParams() body: SetClientsBody) {
    if (!(await this.clientsRepository.checkAllClientIds(body.clients))) {
      throw new BadRequest("Some clients were not found");
    }
    return this.invitationCodesRepository.setClients(id, body.clients);
  }

  @Delete("/:id")
  delete(@PathParams("id") id: string) {
    return this.invitationCodesRepository.delete(id);
  }
}
