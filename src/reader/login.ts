import { PacketKind, PacketSource } from "../packet";
import { ReadersBySource } from "./types";

const readers: ReadersBySource = {
  [PacketSource.Client]: {
    0: (reader) => ({
      kind: PacketKind.Login,
      payload: {
        username: reader.readString(),
      },
    }),

    1: (reader) => ({
      kind: PacketKind.EncryptionResponse,
      payload: {
        sharedSecret: reader.readByteArrayWithPrefix(),
        verifyToken: reader.readByteArrayWithPrefix(),
      },
    }),

    2: (reader) => ({
      kind: PacketKind.LoginPluginResponse,
      payload: {
        messageId: reader.readVarInt(),
        successful: reader.readBoolean(),
        data: !reader.isFinishedReading()
          ? reader.readRemainingByteArray()
          : null,
      },
    }),
  },

  [PacketSource.Server]: {
    0: (reader) => ({
      kind: PacketKind.Disconnect,
      payload: {
        reason: reader.readChat(),
      },
    }),

    1: (reader) => ({
      kind: PacketKind.EncryptionRequest,
      payload: {
        serverId: reader.readString(),
        publicKey: reader.readByteArrayWithPrefix(),
        verifyToken: reader.readByteArrayWithPrefix(),
      },
    }),

    2: (reader) => ({
      kind: PacketKind.LoginSuccess,
      payload: {
        uuid: reader.readUUID(),
        username: reader.readString(),
      },
    }),

    3: (reader) => ({
      kind: PacketKind.SetCompression,
      payload: {
        threshold: reader.readVarInt(),
      },
    }),

    4: (reader) => ({
      kind: PacketKind.LoginPluginRequest,
      payload: {
        messageId: reader.readVarInt(),
        channel: reader.readString(),
        data: reader.readRemainingByteArray(),
      },
    }),
  },
};

export default readers;
