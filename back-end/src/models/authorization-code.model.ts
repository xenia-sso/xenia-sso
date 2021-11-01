import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Format, Required } from "@tsed/schema";
import { ClientModel } from "./client.model";
import { UserModel } from "./user.model";

@Model({ collection: "authorization-codes" })
export class AuthorizationCodeModel {
  @ObjectID("id")
  _id: string;

  @Required()
  @Ref(UserModel)
  userId: Ref<UserModel>;

  @Required()
  @Ref(ClientModel)
  clientId: Ref<ClientModel>;

  @Required()
  scope: string;

  @Required()
  @Format("date-time")
  expiration: Date;

  @Required()
  codeChallenge: string;

  @Required()
  codeChallengeMethod: string;
}
