import { PacketKind } from "./kind";
import { PacketBase } from ".";

export interface LoginPacket extends PacketBase {
  kind: PacketKind.Login;
  payload: {
    username: string;
  };
}

export interface LoginSuccessPacket extends PacketBase {
  kind: PacketKind.LoginSuccess;
  payload: {
    uuid: string;
    username: string;
  };
}

export interface DisconnectPacket extends PacketBase {
  kind: PacketKind.Disconnect;
  payload: {
    reason: string;
  };
}

export interface SetCompressionPacket extends PacketBase {
  kind: PacketKind.SetCompression;
  payload: {
    threshold: number;
  };
}

export interface EncryptionRequestPacket extends PacketBase {
  kind: PacketKind.EncryptionRequest;
  payload: {
    serverId: string;
    publicKey: Buffer;
    verifyToken: Buffer;
  };
}

export interface EncryptionResponsePacket extends PacketBase {
  kind: PacketKind.EncryptionResponse;
  payload: {
    sharedSecret: Buffer;
    verifyToken: Buffer;
  };
}

export interface LoginPluginRequestPacket extends PacketBase {
  kind: PacketKind.LoginPluginRequest;
  payload: {
    messageId: number;
    channel: string;
    data: Buffer;
  };
}

export interface LoginPluginResponsePacket extends PacketBase {
  kind: PacketKind.LoginPluginResponse;
  payload: {
    messageId: number;
    successful: boolean;
    data: Buffer | null;
  };
}

type AnyLoginPacket =
  | LoginPacket
  | LoginSuccessPacket
  | DisconnectPacket
  | SetCompressionPacket
  | EncryptionRequestPacket
  | EncryptionResponsePacket
  | LoginPluginRequestPacket
  | LoginPluginResponsePacket;

export default AnyLoginPacket;
