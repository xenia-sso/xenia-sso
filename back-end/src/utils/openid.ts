import { sign } from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export const generateIdToken = (user: UserModel & { id?: string }) => {
  return sign(
    {
      sub: user.id,
      email: user.email,
      given_name: user.firstName,
      family_name: user.lastName,
    },
    process.env.ID_TOKEN_JWT_KEY
  );
};
