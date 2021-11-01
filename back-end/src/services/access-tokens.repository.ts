import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { AccessTokenModel } from "src/models/access-token.model";

@Injectable()
export class AccessTokensRepository {
  @Inject(AccessTokenModel)
  private model: MongooseModel<AccessTokenModel>;

  async create(obj: Omit<AccessTokenModel, "_id">) {
    const invitationCode = await this.model.create(obj);
    return invitationCode.save();
  }
}
