import { PacketBase } from ".";
import { Chat } from "../../chat/types";
import { NbtTag } from "../../nbt";
import { PacketKind } from "./kind";

export interface JoinGamePacket extends PacketBase {
  kind: PacketKind.JoinGame;
  payload: {
    entityId: number;
    isHardcore: boolean;
    gamemode: number;
    previousGamemode: number;
    worlds: string[];
    dimensionCodec: NbtTag;
    dimension: NbtTag;
    worldName: string;
    hashedSeed: bigint;
    maxPlayers: number;
    viewDistance: number;
    reducedDebugInfo: boolean;
    enableRespawnScreen: boolean;
    isDebug: boolean;
    isFlat: boolean;
  };
}

export interface SendChatMessagePacket extends PacketBase {
  kind: PacketKind.SendChatMessage;
  payload: {
    message: string;
  };
}

export interface ChatMessagePacket extends PacketBase {
  kind: PacketKind.ChatMessage;
  payload: {
    chat: Chat;
    position: number;
    sender: string;
  };
}

type AnyPlayPacket = JoinGamePacket | SendChatMessagePacket | ChatMessagePacket;

export default AnyPlayPacket;
