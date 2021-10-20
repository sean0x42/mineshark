import { State } from "../state";
import Registry from "./registry";
import { DataKind } from "./spec/types";
import { PacketKind, PacketSource } from "./types";
import { JoinGamePacket } from "./types/play";

Registry.register({
  id: 0x03,
  kind: PacketKind.SendChatMessage,
  source: PacketSource.Client,
  state: State.Play,
  spec: {
    message: DataKind.String,
  },
});

Registry.register({
  id: 0x0f,
  kind: PacketKind.ChatMessage,
  source: PacketSource.Server,
  state: State.Play,
  spec: {
    chat: DataKind.Chat,
    position: DataKind.Byte,
    sender: DataKind.Uuid,
  },
});

Registry.register({
  id: 0x26,
  kind: PacketKind.JoinGame,
  source: PacketSource.Server,
  state: State.Play,
  spec: {
    entityId: DataKind.Int,
    isHardcore: DataKind.Boolean,
    gamemode: DataKind.UnsignedByte,
    previousGamemode: DataKind.Byte,
    worlds: {
      read(reader) {
        const length = reader.readVarInt();
        const values = [];

        for (let i = 0; i < length; i++) {
          values.push(reader.readString());
        }

        return values;
      },

      write(writer, packet) {
        const { worlds } = (packet as JoinGamePacket).payload;
        writer.writeVarInt(worlds.length);
        worlds.forEach((world) => writer.writeString(world));
      },
    },
    dimensionCodec: DataKind.NbtCompound,
    dimension: DataKind.NbtCompound,
    worldName: DataKind.String,
    hashedSeed: DataKind.Long,
    maxPlayers: DataKind.VarInt,
    viewDistance: DataKind.VarInt,
    reducedDebugInfo: DataKind.Boolean,
    enableRespawnScreen: DataKind.Boolean,
    isDebug: DataKind.Boolean,
    isFlat: DataKind.Boolean,
  },
});
