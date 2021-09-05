import { State } from "../state";
import Registry from "./registry";
import { PacketKind, PacketSource } from "./types";
import {
  DisconnectPacket,
  EncryptionRequestPacket,
  EncryptionResponsePacket,
  LoginPacket,
  LoginPluginRequestPacket,
  LoginPluginResponsePacket,
  LoginSuccessPacket,
  SetCompressionPacket,
} from "./types/login";

Registry.register({
  id: 0,
  kind: PacketKind.Login,
  source: PacketSource.Client,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.Login,
    payload: {
      username: reader.readString(),
    },
  }),

  write: (writer, packet) => {
    const { username } = (packet as LoginPacket).payload;
    writer.writeString(username);
  },
});

Registry.register({
  id: 2,
  kind: PacketKind.LoginSuccess,
  source: PacketSource.Server,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.LoginSuccess,
    payload: {
      uuid: reader.readUuid(),
      username: reader.readString(),
    },
  }),

  write: (writer, packet) => {
    const { uuid, username } = (packet as LoginSuccessPacket).payload;
    writer.writeUuid(uuid).writeString(username);
  },
});

Registry.register({
  id: 0,
  kind: PacketKind.Disconnect,
  source: PacketSource.Server,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.Disconnect,
    payload: {
      reason: reader.readChat(),
    },
  }),

  write: (writer, packet) => {
    const { reason } = (packet as DisconnectPacket).payload;
    writer.writeChat(reason);
  },
});

Registry.register({
  id: 3,
  kind: PacketKind.SetCompression,
  source: PacketSource.Server,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.SetCompression,
    payload: {
      threshold: reader.readVarInt(),
    },
  }),

  write: (writer, packet) => {
    const { threshold } = (packet as SetCompressionPacket).payload;
    writer.writeVarInt(threshold);
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.EncryptionRequest,
  source: PacketSource.Server,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.EncryptionRequest,
    payload: {
      serverId: reader.readString(),
      publicKey: reader.readByteArrayWithLength(),
      verifyToken: reader.readByteArrayWithLength(),
    },
  }),

  write: (writer, packet) => {
    const { serverId, publicKey, verifyToken } = (
      packet as EncryptionRequestPacket
    ).payload;
    writer
      .writeString(serverId)
      .writeByteArrayWithLength(publicKey)
      .writeByteArrayWithLength(verifyToken);
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.EncryptionResponse,
  source: PacketSource.Client,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.EncryptionResponse,
    payload: {
      sharedSecret: reader.readByteArrayWithLength(),
      verifyToken: reader.readByteArrayWithLength(),
    },
  }),

  write: (writer, packet) => {
    const { sharedSecret, verifyToken } = (packet as EncryptionResponsePacket)
      .payload;
    writer
      .writeByteArrayWithLength(sharedSecret)
      .writeByteArrayWithLength(verifyToken);
  },
});

Registry.register({
  id: 4,
  kind: PacketKind.LoginPluginRequest,
  source: PacketSource.Server,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.LoginPluginRequest,
    payload: {
      messageId: reader.readVarInt(),
      channel: reader.readString(),
      data: reader.readRemainingByteArray(),
    },
  }),

  write: (writer, packet) => {
    const { messageId, channel, data } = (packet as LoginPluginRequestPacket)
      .payload;
    writer.writeVarInt(messageId).writeString(channel).writeByteArray(data);
  },
});

Registry.register({
  id: 2,
  kind: PacketKind.LoginPluginResponse,
  source: PacketSource.Client,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.LoginPluginResponse,
    payload: {
      messageId: reader.readVarInt(),
      successful: reader.readBoolean(),
      data: !reader.isFinishedReading()
        ? reader.readRemainingByteArray()
        : null,
    },
  }),

  write: (writer, packet) => {
    const { messageId, successful, data } = (
      packet as LoginPluginResponsePacket
    ).payload;
    writer.writeVarInt(messageId).writeBoolean(successful);

    if (data) {
      writer.writeByteArray(data);
    }
  },
});
