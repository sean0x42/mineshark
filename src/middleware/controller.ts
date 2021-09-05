import EventEmitter from "events";

import { Packet } from "../packet/types";
import { Middleware, EmitFn, NextFn } from "./types";

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
    const next: NextFn = (pckt = packet) => {
      if (idx + 1 === this.middleware.length) {
        this.emit("packet", pckt);
        return;
      }

      this.executeMiddleware(pckt, idx + 1);
    };

    const emit: EmitFn = (packet) => {
      this.emit("packet", packet);
    };

    this.middleware[idx](packet, next, emit);
  }

  public apply(packet: Packet): void {
    this.executeMiddleware(packet, 0);
  }
}

export default MiddlewareController;
