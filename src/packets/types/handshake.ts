import { PacketBase } from ".";
import { PacketKind } from "./kind";

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
