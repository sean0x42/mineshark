import { Packet, PacketSource } from "../packets/types";

export interface PacketMiddleware {
  (source: PacketSource, packet: Packet): void;
}

const middleware: PacketMiddleware[] = [];

export function applyMiddleware(source: PacketSource, packet: Packet) {
  middleware.forEach((m) => m(source, packet));
}
