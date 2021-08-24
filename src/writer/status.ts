import { PacketKind } from "../packet";
import { WritersByKind } from "./types";

const writers: WritersByKind = {
  [PacketKind.Request]: () => { },

  [PacketKind.Response]: (writer, packet) => {
    const payload = JSON.stringify(packet.payload);
    writer.writeString(payload);
  },

  [PacketKind.Ping]: (writer, packet) => {
    const { timestamp } = packet.payload!;
    writer.writeLong(timestamp as bigint);
  },

  [PacketKind.Pong]: (writer, packet) => {
    const { timestamp } = packet.payload!;
    writer.writeLong(timestamp as bigint);
  },
};

export default writers;
