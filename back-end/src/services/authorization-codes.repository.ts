import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { AuthorizationCodeModel } from "src/models/authorization-code.model";
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
    return this.model.findOne({ _id: id, clientId });
    // return this.model.findByIdAndDelete(id);
  }
}
