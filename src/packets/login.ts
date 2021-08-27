import { State } from "../state";
import Registry from "./registry";
import { PacketKind, PacketSource } from "./types";

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

  write: () => {
    // TODO
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

  write: () => {
    // TODO
  },
});

Registry.register({
  id: 0,
  kind: PacketKind.Disconnect,
  source: PacketSource.Server,
  state: State.Login,

  read: (reader) => ({
    kind: PacketKind.LoginSuccess,
    payload: {
      reason: reader.readChat(),
    },
  }),

  write: () => {
    // TODO
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

  write: () => {
    // TODO
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
      publicKey: reader.readByteArrayWithPrefix(),
      verifyToken: reader.readByteArrayWithPrefix(),
    },
  }),

  write: () => {
    // TODO
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
      sharedSecret: reader.readByteArrayWithPrefix(),
      verifyToken: reader.readByteArrayWithPrefix(),
    },
  }),

  write: () => {
    // TODO
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

  write: () => {
    // TODO
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

  write: () => {
    // TODO
  },
});
