import { BodyParams, Controller, Inject, Post } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Required, MaxLength, Email, MinLength, ContentType } from "@tsed/schema";
import { UsersRepository } from "../services/users.repository";

class InitializeBody {
  @Required()
  @MaxLength(100)
  @Email()
  email: string;

  @Required()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @Required()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @Required()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;
}

@Controller("/init")
@ContentType("application/json")
export class InitializeController {
  @Inject(UsersRepository) private usersRepository: UsersRepository;

  @Post("/start")
  async createAdmin(@BodyParams() body: InitializeBody) {
    if ((await this.usersRepository.countAdmins()) > 0) {
      throw new Forbidden("Server already initialized");
    }
    const user = await this.usersRepository.create(body);
    await this.usersRepository.setAdmin(user.id, true);

    return user;
  }

  @Post("/state")
  async isInitialized() {
    return { initialized: (await this.usersRepository.countAdmins()) > 0 };
  }
}
