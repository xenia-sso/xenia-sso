import { Middleware, Inject } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";
import { UsersRepository } from "../services/users.repository";
import { SERVER_NOT_INITIALIZED } from "../utils/errors";

@Middleware()
export class InitializedMiddleware {
  @Inject(UsersRepository) private repository: UsersRepository;

  async use() {
    if ((await this.repository.countAdmins()) === 0) {
      throw new BadRequest(SERVER_NOT_INITIALIZED);
    }
  }
}
