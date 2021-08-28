import { Packet } from "../packets/types";

export interface NextFn {
  (packet?: Packet): void;
}

export interface EmitFn {
  (packet: Packet): void;
}

export interface Middleware {
  (packet: Packet, next: NextFn, emit: EmitFn): void;
}
