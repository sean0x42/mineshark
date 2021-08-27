import { PacketKind } from "./kind";
import { PacketBase } from ".";

export interface HandshakePacket extends PacketBase {
  kind: PacketKind.Handshake;
  payload: {
    protocolVersion: number;
    host: string;
    port: number;
    nextState: number;
  };
}

type AnyHandshakePacket = HandshakePacket;
export default AnyHandshakePacket;
