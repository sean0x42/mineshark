import { PacketKind } from "./kind";
import { PacketBase } from ".";

export interface RequestPacket extends PacketBase {
  kind: PacketKind.Request;
  payload: null;
}

export interface ResponsePacket extends PacketBase {
  kind: PacketKind.Response;
  payload: {
    version: {
      name: string;
      protocol: number;
    };
    players: {
      max: number;
      online: number;
      sample: Array<{ name: string; id: string }>;
    };
    description: {
      text: string;
    };
    favicon?: string;
  };
}

export interface PingPacket extends PacketBase {
  kind: PacketKind.Ping;
  payload: {
    timestamp: bigint;
  };
}

export interface PongPacket extends PacketBase {
  kind: PacketKind.Pong;
  payload: {
    timestamp: bigint;
  };
}

type AnyStatusPacket = RequestPacket | ResponsePacket | PingPacket | PongPacket;

export default AnyStatusPacket;
