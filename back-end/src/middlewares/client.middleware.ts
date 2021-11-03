import { Middleware, Req, Res, Inject, Context } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { ClientsRepository } from "../services/clients.repository";
import { comparePasswords } from "../utils/bcrypt";

@Middleware()
export class ClientMiddleware {
  @Inject(ClientsRepository) private repository: ClientsRepository;

  async use(@Req() req: Req, @Res() res: Res, @Context() ctx: Context) {
    const clientId = req.headers["client_id"] as string;
    const clientSecret = req.headers["client_secret"] as string;
    if (!clientId || !clientSecret) {
      throw new Unauthorized("Unauthorized");
    }

    if (!/^[0-9a-zA-Z]{24}$/.test(clientId)) {
      throw new Unauthorized("Unauthorized");
    }

    const client = await this.repository.findById(clientId);
    if (!client) {
      throw new Unauthorized("Unauthorized");
    }

    if (!(await comparePasswords(clientSecret, client.secret))) {
      throw new Unauthorized("Unauthorized");
    }

    ctx.set("client", client);
  }
}
