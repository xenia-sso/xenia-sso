import { sign } from "jsonwebtoken";
import { UserModel } from "../models/user.model";

interface IdToken {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}

export const generateIdToken = (user: UserModel & { id?: string }, scope: string) => {
  const splitScope = scope.split(" ");
  const obj: IdToken = {};

  if (splitScope.includes("openid")) {
    obj.sub = user.id;

    if (splitScope.includes("email")) {
      obj.email = user.email;
    }

    if (splitScope.includes("profile")) {
      obj.given_name = user.firstName;
      obj.family_name = user.lastName;
    }
  }

  return sign(obj, process.env.ID_TOKEN_JWT_KEY);
};
