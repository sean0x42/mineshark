import { PacketBase } from ".";
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

type AnyPlayPacket = JoinGamePacket;

export default AnyPlayPacket;
