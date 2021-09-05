import { State } from "../state";
import Registry from "./registry";
import { PacketKind, PacketSource } from "./types";
import { JoinGamePacket } from "./types/play";

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

  write: (writer, packet) => {
    const payload = (packet as JoinGamePacket).payload;
    writer
      .writeInt(payload.entityId)
      .writeBoolean(payload.isHardcore)
      .writeUnsignedByte(payload.gamemode)
      .writeByte(payload.previousGamemode)
      .writeIdentifierArray(payload.worlds)
      .writeNbt(payload.dimensionCodec)
      .writeNbt(payload.dimension)
      .writeString(payload.worldName)
      .writeLong(payload.hashedSeed)
      .writeVarInt(payload.maxPlayers)
      .writeVarInt(payload.viewDistance)
      .writeBoolean(payload.reducedDebugInfo)
      .writeBoolean(payload.enableRespawnScreen)
      .writeBoolean(payload.isDebug)
      .writeBoolean(payload.isFlat);
  },
});
