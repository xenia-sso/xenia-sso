import { Middleware } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Unauthorized, NotFound, Forbidden } from "@tsed/exceptions";
import { AccessTokensRepository } from "../../services/access-tokens.repository";
import { ClientsRepository } from "../../services/clients.repository";
import { UsersRepository } from "../../services/users.repository";

const BEARER_PREFIX = "Bearer ";

@Middleware()
export class AccessTokenMiddleware {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  async getUserFromToken(token: string | undefined) {
    if (!token) {
      throw new Unauthorized("No access token provided");
    }

    if (token.startsWith(BEARER_PREFIX)) {
      token = token.substring(BEARER_PREFIX.length);
    }

    const accessToken = await this.accessTokensRepository.getAccessTokenByToken(token);
    if (!accessToken) {
      throw new NotFound("Access token not found");
    }

    const client = await this.clientsRepository.findById(accessToken.clientId.toString());
    if (!client) {
      throw new NotFound("Client not found");
    }

    if (!this.accessTokensRepository.isAccessTokenActive(accessToken)) {
      await this.accessTokensRepository.deleteByToken(token);
      throw new Unauthorized("Access token expired");
    }

    if (!this.clientsRepository.isUserGrantedToClient(accessToken.userId.toString(), client)) {
      throw new Forbidden("Forbidden");
    }

    const user = await this.usersRepository.findById(accessToken.userId.toString());
    if (!user) {
      throw new NotFound("User not found");
    }

    return { user, token };
  }
}
