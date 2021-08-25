import AnyHandshakePacket from "./handshake";
import AnyStatusPacket from "./status";
import AnyLoginPacket from "./login";
import { PacketKind } from "./kind";

export enum PacketSource {
  Client = "client",
  Server = "server",
}

export interface PacketBase {
  kind: PacketKind;
  id: number;
  source: PacketSource;
  payload: unknown;
}

export type Packet = AnyHandshakePacket | AnyStatusPacket | AnyLoginPacket;
export { PacketKind } from "./kind";
