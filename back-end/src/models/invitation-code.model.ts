import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Required } from "@tsed/schema";
import { ClientModel } from "./client.model";

@Model({ collection: "invitation-codes" })
export class InvitationCodeModel {
  @ObjectID("id")
  _id: string;

  @Required()
  code: string;

  @Required()
  @Ref(ClientModel)
  clients: Ref<ClientModel>[];
}
