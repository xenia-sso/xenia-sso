import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { InvitationCodeModel } from "../models/invitation-code.model";

@Injectable()
export class InvitationCodesRepository {
  @Inject(InvitationCodeModel)
  private model: MongooseModel<InvitationCodeModel>;

  getAll() {
    return this.model.find({});
  }

  exists(id: string) {
    return this.model.exists({ _id: id });
  }

  async create() {
    const invitationCode = await this.model.create({});
    return invitationCode.save();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
