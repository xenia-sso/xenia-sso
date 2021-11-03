import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication, PlatformStaticsSettings } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import express from "express";
import "@tsed/ajv";
import { config, rootDir } from "./config";

const statics: PlatformStaticsSettings = {};
if (process.env.NODE_ENV === "production") {
  statics["/"] = [
    {
      root: `${rootDir}/public`,
      hook: "$beforeRoutesInit",
    },
  ];
}

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
  statics,
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app.use(cookieParser()).use(compress({})).use(methodOverride()).use(express.json());
  }
}
