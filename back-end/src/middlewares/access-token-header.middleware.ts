import { Middleware, Req, Res, Next, Inject, Context } from "@tsed/common";
import { Forbidden, NotFound, Unauthorized } from "@tsed/exceptions";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { ClientsRepository } from "../services/clients.repository";
import { UsersRepository } from "../services/users.repository";

const BEARER_PREFIX = "Bearer ";

@Middleware()
export class AccessTokenHeaderMiddleware {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  async use(@Context() ctx: Context, @Req() req: Req, @Res() res: Res, @Next() next: Next) {
    let token = req.headers["authorization"];
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

    const user = await this.usersRepository.findById(accessToken.userId.toString());
    if (!user) {
      throw new NotFound("User not found");
    }

    if (!this.clientsRepository.isUserGrantedToClient(accessToken.userId.toString(), client)) {
      throw new Forbidden("Forbidden");
    }

    ctx.set("user", user);
    ctx.set("token", token);
    next();
  }
}
