import { Middleware, Req, Res, Next } from "@tsed/common";

@Middleware()
export class AuthMiddleware {
  use(@Req() req: Req, @Res() res: Res, @Next() next: Next) {}
}
