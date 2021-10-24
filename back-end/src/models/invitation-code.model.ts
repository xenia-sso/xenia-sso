import { Model, ObjectID } from "@tsed/mongoose";

@Model({ collection: "invitation-codes" })
export class InvitationCodeModel {
  @ObjectID("id")
  _id: string;
}
