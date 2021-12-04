import { BodyParams, Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { CollectionOf, ContentType, Delete, Post, Put, Required } from "@tsed/schema";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
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
export class InvitationCodesController {
  @Inject(InvitationCodesRepository) private repository: InvitationCodesRepository;

  @Get("/")
  getAll() {
    return this.repository.getAll();
  }

  @Post("/")
  create() {
    return this.repository.create();
  }

  @Put("/:id/clients")
  setClients(@PathParams("id") id: string, @BodyParams() body: SetClientsBody) {
    return this.repository.setClients(id, body.clients);
  }

  @Delete("/:id")
  delete(@PathParams("id") id: string) {
    return this.repository.delete(id);
  }
}
