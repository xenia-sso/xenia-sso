import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { InvitationCodeModel } from "../models/invitation-code.model";
import { generate } from "randomstring";
import { ClientModel } from "../models/client.model";
import { BadRequest } from "@tsed/exceptions";

@Injectable()
export class InvitationCodesRepository {
  @Inject(InvitationCodeModel)
  private invitationCodesModel: MongooseModel<InvitationCodeModel>;

  @Inject(ClientModel)
  private clientsModel: MongooseModel<ClientModel>;

  getAll() {
    return this.invitationCodesModel.find({});
  }

  findByCode(code: string) {
    return this.invitationCodesModel.findOne({ code });
  }

  async create() {
    const code = generate({ length: 20 });
    const invitationCode = await this.invitationCodesModel.create({ code, clients: [] });
    return invitationCode.save();
  }

  async setClients(id: string, clients: string[]) {
    const clientPromises = clients.map((c) => this.clientsModel.exists({ _id: c }));
    const promiseResults = await Promise.allSettled(clientPromises);
    if (!promiseResults.every((r) => r.status === "fulfilled" && r.value)) {
      throw new BadRequest("Some clients were not found.");
    }

    return this.invitationCodesModel.findByIdAndUpdate(id, { clients }, { new: true });
  }

  delete(id: string) {
    return this.invitationCodesModel.findByIdAndDelete(id);
  }

  deleteByCode(code: string) {
    return this.invitationCodesModel.findOneAndDelete({ code });
  }
}
