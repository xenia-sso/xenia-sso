import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { DateTime } from "luxon";
import { AccessTokenModel } from "../models/access-token.model";

@Injectable()
export class AccessTokensRepository {
  @Inject(AccessTokenModel)
  private model: MongooseModel<AccessTokenModel>;

  async create(obj: Omit<AccessTokenModel, "_id">) {
    const invitationCode = await this.model.create(obj);
    return invitationCode.save();
  }

  async isAccessTokenActive(accessToken: AccessTokenModel) {
    return DateTime.fromJSDate(accessToken.lastUsed).diff(DateTime.now(), "days").days >= -90;
  }

  async updateAccessTokenLastUsed(token: string) {
    return this.model.findOneAndUpdate({ token }, { lastUsed: DateTime.now().toJSDate() }, { new: true });
  }

  getAccessTokenByToken(token: string) {
    return this.model.findOne({ token });
  }

  deleteByToken(token: string) {
    return this.model.findOneAndDelete({ token });
  }

  deleteByUser(userId: string) {
    return this.model.deleteMany({ userId });
  }
}
