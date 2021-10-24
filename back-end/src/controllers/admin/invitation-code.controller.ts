import { Controller, Get, Inject, PathParams, UseAuth } from "@tsed/common";
import { ContentType, Delete, Post } from "@tsed/schema";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { InvitationCodesRepository } from "src/services/invitation-codes.repository";

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

  @Delete("/:id")
  delete(@PathParams("id") id: string) {
    return this.repository.delete(id);
  }
}
