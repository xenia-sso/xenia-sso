import { OnDeserialize } from "@tsed/json-mapper";
import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Format, Required } from "@tsed/schema";
import { ClientModel } from "./client.model";
import { UserModel } from "./user.model";

@Model({ collection: "access-tokens" })
export class AccessTokenModel {
  // Workaround to prevent passing "id" in incoming requests
  @OnDeserialize((v) => {
    if (typeof v === "string") {
      return undefined;
    }
    return v;
  })
  @ObjectID("id")
  _id: string;

  @Required()
  @Ref(UserModel)
  userId: Ref<UserModel>;

  @Required()
  @Ref(ClientModel)
  clientId: Ref<ClientModel>;

  @Required()
  token: string;

  @Required()
  @Format("date-time")
  lastUsed: Date;
}
