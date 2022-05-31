import { Middleware, Req, Res, Next, Inject, Context } from "@tsed/common";
import { Unauthorized, InternalServerError, Forbidden, NotFound } from "@tsed/exceptions";
import { AccessTokensRepository } from "../services/access-tokens.repository";
import { ClientsRepository } from "../services/clients.repository";
import { UsersRepository } from "../services/users.repository";

@Middleware()
export class AccessTokenQueryMiddleware {
  @Inject(AccessTokensRepository) private accessTokensRepository: AccessTokensRepository;
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(ClientsRepository) private clientsRepository: ClientsRepository;

  async use(@Context() ctx: Context, @Req() req: Req, @Res() res: Res, @Next() next: Next) {
    const options = ctx.endpoint.get(AccessTokenQueryMiddleware) || { isIntrospectEndpoint: false };

    try {
      const token = req.query.token?.toString();
      if (!token) {
        throw new Unauthorized("No access token provided");
      }

      const client = ctx.get("client");
      if (!client) {
        // ClientMiddleware should run before AccessTokenMiddleware
        throw new InternalServerError("Internal Server Error");
      }

      const { active, userId } = await this.accessTokensRepository.isAccessTokenActive(token, client.id);
      if (!active) {
        await this.accessTokensRepository.deleteByToken(token, client.id);
        throw new Unauthorized("Access token expired");
      }

      if (!this.clientsRepository.isUserGrantedToClient(userId.toString(), client)) {
        throw new Forbidden("Forbidden");
      }

      const user = await this.usersRepository.findById(userId.toString());
      if (!user) {
        throw new NotFound("User not found");
      }

      ctx.set("user", user);
    } catch (err) {
      if (options.isIntrospectEndpoint) {
        res.status(401).json({ active: false });
        return;
      }
      throw err;
    }

    next();
  }
}
