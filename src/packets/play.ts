import { State } from "../state";
import Registry from "./registry";
import { PacketKind, PacketSource } from "./types";

Registry.register({
  id: 0x26,
  kind: PacketKind.JoinGame,
  source: PacketSource.Server,
  state: State.Play,

  read: (reader) => ({
    kind: PacketKind.JoinGame,
    payload: {
      entityId: reader.readInt(),
      isHardcore: reader.readBoolean(),
      gamemode: reader.readUnsignedByte(),
      previousGamemode: reader.readByte(),
      worlds: reader.readIdentifierArray(),
      dimensionCodec: reader.readNbt(),
      dimension: reader.readNbt(),
      worldName: reader.readString(),
      hashedSeed: reader.readLong(),
      maxPlayers: reader.readVarInt(),
      viewDistance: reader.readVarInt(),
      reducedDebugInfo: reader.readBoolean(),
      enableRespawnScreen: reader.readBoolean(),
      isDebug: reader.readBoolean(),
      isFlat: reader.readBoolean(),
    },
  }),

  write: () => {
    // Do nothing
  },
});
