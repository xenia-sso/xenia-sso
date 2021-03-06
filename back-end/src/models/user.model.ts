import { OnDeserialize, OnSerialize } from "@tsed/json-mapper";
import { Model, ObjectID, Unique } from "@tsed/mongoose";
import { CollectionOf, Default, Email, MinLength, Required } from "@tsed/schema";

@Model({ collection: "users" })
export class UserModel {
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
  @Email()
  @Unique()
  email: string;

  @Required()
  // Removing from payload before sending to front-end
  @OnSerialize(() => undefined)
  password: string;

  @Required()
  @MinLength(2)
  firstName: string;

  @Required()
  @MinLength(2)
  lastName: string;

  @CollectionOf(String)
  @Default(() => [])
  roles: string[];
}
