import { PacketBase } from ".";
import { PacketKind } from "./kind";

export interface JoinGamePacket extends PacketBase {
  kind: PacketKind.JoinGame;
  payload: {
    entityId: number;
    isHardcore: boolean;
    gamemode: number;
    previousGamemode: number;
    worlds: string[];
    dimensionCodec: unknown;
    dimension: unknown;
    worldName: string;
    hashedSeed: BigInt;
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
