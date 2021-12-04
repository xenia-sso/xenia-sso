import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { InvitationCodeModel } from "../models/invitation-code.model";
import { generate } from "randomstring";
import { Types } from "mongoose";

@Injectable()
export class InvitationCodesRepository {
  @Inject(InvitationCodeModel)
  private model: MongooseModel<InvitationCodeModel>;

  getAll() {
    return this.model.find({});
  }

  findByCode(code: string) {
    return this.model.findOne({ code });
  }

  async create() {
    const code = generate({ length: 20 });
    const invitationCode = await this.model.create({ code, clients: [] });
    return invitationCode.save();
  }

  async setClients(id: string, clients: string[]) {
    return this.model.findByIdAndUpdate(id, { clients }, { new: true });
  }

  removeClientFromAllInvitationCodes(clientId: string) {
    return this.model.updateMany({}, { $pull: { clients: new Types.ObjectId(clientId) } });
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  deleteByCode(code: string) {
    return this.model.findOneAndDelete({ code });
  }
}
