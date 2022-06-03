import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import express from "express";
import "@tsed/ajv";
import { config, rootDir } from "./config";
import history from "connect-history-api-fallback";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 3000,
  httpsPort: false, // CHANGE
  mount: {
    "/api": [`${rootDir}/controllers/**/*.ts`],
  },
  exclude: ["**/*.spec.ts"],
  mongoose: [
    {
      id: "default",
      url: process.env.MONGODB_URI,
      connectionOptions: {},
    },
  ],
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app.use(cookieParser()).use(compress({})).use(methodOverride()).use(express.json());
    if (process.env.NODE_ENV === "production") {
      // https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md#configuring-the-middleware
      const staticFileMiddleware = express.static(`${rootDir}/public`);
      this.app.use(staticFileMiddleware);
      this.app.use(
        history({
          disableDotRule: true,
          verbose: true,
        })
      );
      this.app.use(staticFileMiddleware);
    }
  }
}
