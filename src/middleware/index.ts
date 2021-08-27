import MiddlewareController from "./controller";
import customStatus from "./lib/customStatus";

export default function initialiseMiddleware(): MiddlewareController {
  const controller = new MiddlewareController();

  controller.use(customStatus);

  return controller;
}
