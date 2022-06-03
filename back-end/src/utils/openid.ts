import { sign } from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { DateTime } from "luxon";

export interface IdToken extends UserObj {
  iss: string;
  aud: string;
  exp: number;
}

export interface UserObj {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}

export const generateUserObj = (user: UserModel & { id?: string }, scope: string) => {
  const obj: UserObj = {};
  const splitScope = scope.split(" ");

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

  return obj;
};

export const generateIdToken = (
  issuerUrl: string,
  clientId: string,
  user: UserModel & { id?: string },
  scope: string
) => {
  const obj: IdToken = {
    iss: issuerUrl,
    aud: clientId,
    exp: DateTime.now().plus({ minutes: 15 }).toUnixInteger(),
    ...generateUserObj(user, scope),
  };

  return sign(obj, "xenia");
};
