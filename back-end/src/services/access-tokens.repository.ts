import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
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

  async isAccessTokenActive(token: string, clientId: string) {
    const accessToken = await this.model.findOne({ token, clientId });
    if (!accessToken) {
      throw new NotFound("Access token not found");
    }
    const lastUsed = accessToken.lastUsed;
    if (DateTime.fromJSDate(lastUsed).diff(DateTime.now(), "days").days < -90) {
      return { active: false };
    }

    accessToken.lastUsed = DateTime.now().toJSDate();
    await accessToken.save();
    return { active: true };
  }

  getAccessTokenByToken(token: string) {
    return this.model.findOne({ token });
  }

  deleteByToken(token: string, clientId: string) {
    return this.model.findOneAndDelete({ token, clientId });
  }

  deleteByUser(userId: string) {
    return this.model.deleteMany({ userId });
  }
}
