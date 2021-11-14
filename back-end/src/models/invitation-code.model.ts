import { Model, ObjectID } from "@tsed/mongoose";
import { Required } from "@tsed/schema";

@Model({ collection: "invitation-codes" })
export class InvitationCodeModel {
  @ObjectID("id")
  _id: string;

  @Required()
  code: string;
}
