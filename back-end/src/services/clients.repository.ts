import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { ClientModel } from "../models/client.model";

@Injectable()
export class ClientsRepository {
  @Inject(ClientModel)
  private model: MongooseModel<ClientModel>;

  getAll() {
    return this.model.find({});
  }

  async create(obj: ClientModel) {
    const model = await this.model.create(obj);
    model.save();

    return model;
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
