import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { ClientModel } from "../models/client.model";
import { encryptPassword } from "../utils/bcrypt";
import { uuid } from "uuidv4";

@Injectable()
export class ClientsRepository {
  @Inject(ClientModel)
  private model: MongooseModel<ClientModel>;

  getAll() {
    return this.model.find({});
  }

  async create(obj: ClientModel) {
    const model = await this.model.create(obj);
    model.secret = "";
    await model.save();

    return model;
  }

  async resetSecret(id: string) {
    const model = await this.model.findById(id);
    if (!model) {
      throw new NotFound("Not Found");
    }
    const secret = uuid();
    model.secret = await encryptPassword(secret);
    await model.save();

    return {
      secret,
    };
  }

  async update(id: string, client: ClientModel) {
    const model = await this.model.findByIdAndUpdate(id, client, { new: true });
    if (!model) {
      throw new NotFound("Not Found");
    }

    return model;
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
