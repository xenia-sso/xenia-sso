import { Controller, Get } from "@tsed/common";
import { ContentType } from "@tsed/schema";

@Controller("/hello-world")
@ContentType("application/json")
export class HelloWorldController {
  @Get("/")
  get() {
    return { success: true };
  }
}
