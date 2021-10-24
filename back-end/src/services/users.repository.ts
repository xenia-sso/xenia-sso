import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { UserModel } from "src/models/user.model";
import { comparePasswords, encryptPassword } from "src/utils/bcrypt";

@Injectable()
export class UsersRepository {
  @Inject(UserModel)
  private model: MongooseModel<UserModel>;

  getAll() {
    return this.model.find({});
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

  async create(obj: UserModel) {
    const model = await this.model.create({
      ...obj,
      password: await encryptPassword(obj.password),
    });
    model.save();

    return model;
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
