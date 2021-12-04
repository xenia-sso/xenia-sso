import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { ClientModel } from "../models/client.model";
import { encryptPassword } from "../utils/bcrypt";
import { uuid } from "uuidv4";
import { Types } from "mongoose";

@Injectable()
export class ClientsRepository {
  @Inject(ClientModel)
  private model: MongooseModel<ClientModel>;

  getAll() {
    return this.model.find({});
  }

  findById(id: string) {
    return this.model.findById(id);
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

  async checkAllClientIds(clientIds: string[]) {
    const clientPromises = clientIds.map((c) => this.model.exists({ _id: c }));
    const promiseResults = await Promise.allSettled(clientPromises);
    return promiseResults.every((r) => r.status === "fulfilled" && r.value);
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  addUserToGrantedUsers(clientId: string, userId: string) {
    return this.model.findByIdAndUpdate(
      clientId,
      { $push: { grantedUsers: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  removeUserFromGrantedUsers(userId: string) {
    return this.model.updateMany({}, { $pull: { grantedUsers: new Types.ObjectId(userId) } });
  }

  isUserGrantedToClient(userId: string, client: ClientModel) {
    if (client.allUsers) {
      return true;
    }
    return client.grantedUsers.includes(userId);
  }
}
