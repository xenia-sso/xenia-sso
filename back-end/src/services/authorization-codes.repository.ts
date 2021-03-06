import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { AuthorizationCodeModel } from "../models/authorization-code.model";
import { DateTime } from "luxon";

@Injectable()
export class AuthorizationCodesRepository {
  @Inject(AuthorizationCodeModel)
  private model: MongooseModel<AuthorizationCodeModel>;

  async create(obj: Omit<AuthorizationCodeModel, "_id" | "expiration">) {
    const model = await this.model.create({
      ...obj,
      expiration: DateTime.now().plus({ minutes: 1 }).toJSDate(),
    });
    await model.save();

    return model;
  }

  findAndDelete(id: string, clientId: string) {
    return this.model.findOneAndDelete({ _id: id, clientId });
  }

  deleteByUser(userId: string) {
    return this.model.deleteMany({ userId });
  }
}
