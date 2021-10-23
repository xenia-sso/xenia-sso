import { genSalt, hash, compare } from "bcrypt";

const SALT_WORK_FACTOR = 10;

export const encryptPassword = (plainTextPassword: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        reject(err);
      }

      hash(plainTextPassword, salt, function (err, hash) {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePasswords = async (candidatePassword: string, hashedPassword: string) => {
  return new Promise((resolve) => {
    compare(candidatePassword, hashedPassword, function (err, isMatch) {
      resolve(!err && isMatch);
    });
  });
};
