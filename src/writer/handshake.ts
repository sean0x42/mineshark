import { PacketKind } from "../packet";
import { WritersByKind } from "./types";

const writers: WritersByKind = {
  [PacketKind.Handshake]: (writer, packet) => {
    const { protocolVersion, host, port, nextState } = packet.payload!;
    writer
      .writeVarInt(protocolVersion as number)
      .writeString(host as string)
      .writeUnsignedShort(port as number)
      .writeVarInt(nextState as number);
  },
};

export default writers;
