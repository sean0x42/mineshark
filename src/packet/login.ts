import { State } from "../state";
import Registry from "./registry";
import { DataKind } from "./spec/types";
import { PacketKind, PacketSource } from "./types";

Registry.register({
  id: 0,
  kind: PacketKind.Login,
  source: PacketSource.Client,
  state: State.Login,
  spec: {
    username: DataKind.String,
  },
});

Registry.register({
  id: 2,
  kind: PacketKind.LoginSuccess,
  source: PacketSource.Server,
  state: State.Login,
  spec: {
    uuid: DataKind.Uuid,
    username: DataKind.String,
  },
});

Registry.register({
  id: 0,
  kind: PacketKind.Disconnect,
  source: PacketSource.Server,
  state: State.Login,
  spec: {
    reason: DataKind.Chat,
  },
});

Registry.register({
  id: 3,
  kind: PacketKind.SetCompression,
  source: PacketSource.Server,
  state: State.Login,
  spec: {
    threshold: DataKind.VarInt,
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.EncryptionRequest,
  source: PacketSource.Server,
  state: State.Login,
  spec: {
    serverId: DataKind.String,
    publicKey: DataKind.ByteArrayWithLength,
    verifyToken: DataKind.ByteArrayWithLength,
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.EncryptionResponse,
  source: PacketSource.Client,
  state: State.Login,
  spec: {
    sharedSecret: DataKind.ByteArrayWithLength,
    verifyToken: DataKind.ByteArrayWithLength,
  },
});

Registry.register({
  id: 4,
  kind: PacketKind.LoginPluginRequest,
  source: PacketSource.Server,
  state: State.Login,
  spec: {
    messageId: DataKind.VarInt,
    channel: DataKind.String,
    data: DataKind.ByteArray,
  },
});

Registry.register({
  id: 2,
  kind: PacketKind.LoginPluginResponse,
  source: PacketSource.Client,
  state: State.Login,
  spec: {
    messageId: DataKind.VarInt,
    successful: DataKind.Boolean,
    data: {
      kind: DataKind.ByteArray,
      optional: true,
    },
  },
});
