import AnyHandshakePacket from "./handshake";
import AnyStatusPacket from "./status";
import AnyLoginPacket from "./login";
import AnyPlayPacket from "./play";
import { PacketKind } from "./kind";

export enum PacketSource {
  Client = "client",
  Server = "server",
}

export interface PacketBase {
  kind: PacketKind;
  id: number;
  source: PacketSource;
  isCompressed: boolean;
  payload: unknown;
}

export type Packet =
  | AnyHandshakePacket
  | AnyStatusPacket
  | AnyLoginPacket
  | AnyPlayPacket;
export { PacketKind } from "./kind";
