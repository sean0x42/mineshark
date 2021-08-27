import { Packet } from "../packets/types";

export interface NextFn {
  (packet?: Packet): void;
}

export interface EmitFn {
  (packet: Packet): void;
}

export interface MiddlewareCallbacks {
  next: NextFn;
  emit: EmitFn;
}

export interface Middleware {
  (packet: Packet, callbacks: MiddlewareCallbacks): void;
}
