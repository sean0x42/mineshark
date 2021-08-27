import EventEmitter from "events";

import { Packet } from "../packets/types";
import { Middleware, MiddlewareCallbacks } from "./types";

declare interface MiddlewareController {
  on(event: "packet", listener: (packet: Packet) => void): this;
  emit(event: "packet", packet: Packet): boolean;
}

class MiddlewareController extends EventEmitter {
  private middleware: Middleware[] = [];

  constructor() {
    super();
  }

  public use(middleware: Middleware): void {
    this.middleware.push(middleware);
  }

  private executeMiddleware(packet: Packet, idx: number): void {
    const callbacks: MiddlewareCallbacks = {
      next: (pckt = packet) => {
        if (idx + 1 === this.middleware.length) {
          this.emit("packet", pckt);
          return;
        }

        this.executeMiddleware(pckt, idx + 1);
      },

      emit: (packet) => {
        this.emit("packet", packet);
      },
    };

    this.middleware[idx](packet, callbacks);
  }

  public apply(packet: Packet): void {
    this.executeMiddleware(packet, 0);
  }
}

export default MiddlewareController;
