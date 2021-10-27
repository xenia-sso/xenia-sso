import { OnDeserialize } from "@tsed/json-mapper";
import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Ignore, Required } from "@tsed/schema";
import { UserModel } from "./user.model";

@Model({ collection: "clients" })
export class ClientModel {
  // Workaround to prevent passing "id" in incoming requests
  @OnDeserialize((v) => {
    if (typeof v === "string") {
      return undefined;
    }
    return v;
  })
  @ObjectID("id")
  _id: string;

  @Ignore()
  secret: string;

  @Required()
  name: string;

  @Required()
  allUsers: boolean;

  @Required()
  @Ref(UserModel)
  grantedUsers: Ref<UserModel>[];
}
