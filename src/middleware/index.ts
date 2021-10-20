import MiddlewareController from "./controller";
import commandHandler from "./lib/commandHandler";
import customStatus from "./lib/customStatus";

export default function initialiseMiddleware(): MiddlewareController {
  const controller = new MiddlewareController();

  controller.use(customStatus);
  controller.use(commandHandler);

  return controller;
}
