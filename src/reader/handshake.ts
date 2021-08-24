import { PacketKind, PacketSource } from "../packet";
import { ReadersBySource } from "./types";

const readers: ReadersBySource = {
  [PacketSource.Client]: {
    0: (reader) => ({
      kind: PacketKind.Handshake,
      payload: {
        protocolVersion: reader.readVarInt(),
        host: reader.readString(),
        port: reader.readUnsignedShort(),
        nextState: reader.readVarInt(),
      },
    }),
  },

  [PacketSource.Server]: {},
};

export default readers;
