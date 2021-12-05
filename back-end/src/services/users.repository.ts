import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { Types } from "mongoose";
import { UserModel } from "../models/user.model";
import { comparePasswords, encryptPassword } from "../utils/bcrypt";

@Injectable()
export class UsersRepository {
  @Inject(UserModel)
  private model: MongooseModel<UserModel>;

  getAll() {
    return this.model.find({});
  }

  countAdmins() {
    return this.model
      .find({
        $expr: {
          $in: ["admin", "$roles"],
        },
      })
      .countDocuments();
  }

  findById(id: string) {
    return this.model.findById(id);
  }

  async checkPassword(email: string, password: string) {
    const user = await this.model.findOne({ email });
    if (!user) {
      return null;
    }

    if (!(await comparePasswords(password, user.password))) {
      return null;
    }

    return user;
  }

  async create(obj: Omit<UserModel, "_id" | "roles">) {
    const model = await this.model.create({
      ...obj,
      email: obj.email.toLowerCase(),
      password: await encryptPassword(obj.password),
    });
    await model.save();

    return model;
  }

  async update(id: string, obj: { email: string; firstName: string; lastName: string }) {
    const model = await this.model.findByIdAndUpdate(
      id,
      {
        ...obj,
        email: obj.email.toLowerCase(),
      },
      { new: true }
    );
    if (!model) {
      throw new NotFound("Not Found");
    }

    return model;
  }

  async updatePassword(id: string, newPassword: string) {
    const model = await this.model.findByIdAndUpdate(
      id,
      { password: await encryptPassword(newPassword) },
      { new: true }
    );
    if (!model) {
      throw new NotFound("Not Found");
    }

    return model;
  }

  async setAdmin(id: string, value: boolean) {
    const user = await this.model.findById(id);
    if (!user) {
      throw new NotFound("Not Found");
    }

    if (value && user.roles.includes("admin")) {
      return user;
    } else if (!value && !user.roles.includes("admin")) {
      return user;
    }

    const mongoKeyword = value ? "$push" : "$pull";
    return this.model.findByIdAndUpdate(id, { [mongoKeyword]: { roles: "admin" } }, { new: true });
  }

  async isLastAdmin(id: string) {
    const otherAdminCount = await this.model
      .find({
        roles: ["admin"],
        _id: { $ne: new Types.ObjectId(id) },
      })
      .count();
    return otherAdminCount === 0;
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
