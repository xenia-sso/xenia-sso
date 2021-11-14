import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { InvitationCodeModel } from "../models/invitation-code.model";
import { generate } from "randomstring";

@Injectable()
export class InvitationCodesRepository {
  @Inject(InvitationCodeModel)
  private model: MongooseModel<InvitationCodeModel>;

  getAll() {
    return this.model.find({});
  }

  exists(code: string) {
    return this.model.exists({ code });
  }

  async create() {
    const code = generate({ length: 20 });
    const invitationCode = await this.model.create({ code });
    return invitationCode.save();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  deleteByCode(code: string) {
    return this.model.findOneAndDelete({ code });
  }
}
