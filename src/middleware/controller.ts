import EventEmitter from "events";

import { Packet } from "../packet/types";
import { AppSelector, Store } from "../store";
import { Middleware, EmitPacket, NextFn, SendMessage } from "./types";
import { createSimpleMessagePacket } from "../chat/createPacket";

declare interface MiddlewareController {
  on(event: "packet", listener: (packet: Packet) => void): this;
  emit(event: "packet", packet: Packet): boolean;
}

class MiddlewareController extends EventEmitter {
  private middleware: Middleware[] = [];

  public use(middleware: Middleware): void {
    this.middleware.push(middleware);
  }

  private executeMiddleware(packet: Packet, store: Store, idx: number): void {
    const emit: EmitPacket = (packet) => {
      this.emit("packet", packet);
    };

    const next: NextFn = (pckt = packet) => {
      if (idx + 1 === this.middleware.length) {
        emit(pckt);
        return;
      }

      this.executeMiddleware(pckt, store, idx + 1);
    };

    function useSelector<Selected>(selector: AppSelector<Selected>): Selected {
      return selector(store.getState());
    }

    const sendMessage: SendMessage = (...messages) => {
      messages.forEach((message) => {
        emit(createSimpleMessagePacket(packet, message));
      });
    };

    this.middleware[idx](packet, {
      next,
      emit,
      dispatch: store.dispatch,
      useSelector,
      sendMessage,
    });
  }

  public apply(packet: Packet, store: Store): void {
    this.executeMiddleware(packet, store, 0);
  }
}

export default MiddlewareController;
