import { State } from "../state";
import Registry from "./registry";
import { PacketKind, PacketSource } from "./types";
import { PingPacket, PongPacket, ResponsePacket } from "./types/status";

Registry.register({
  id: 0,
  kind: PacketKind.Request,
  state: State.Status,
  source: PacketSource.Client,

  read: () => ({
    kind: PacketKind.Request,
    payload: null,
  }),

  write: () => {
    // do nothing
  },
});

Registry.register({
  id: 0,
  kind: PacketKind.Response,
  state: State.Status,
  source: PacketSource.Server,

  read: (reader) => ({
    kind: PacketKind.Response,
    payload: {
      ...JSON.parse(reader.readString()),
    },
  }),

  write: (writer, packet) => {
    const payload = JSON.stringify((packet as ResponsePacket).payload);
    writer.writeString(payload);
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.Ping,
  state: State.Status,
  source: PacketSource.Client,

  read: (reader) => ({
    kind: PacketKind.Ping,
    payload: {
      timestamp: reader.readLong(),
    },
  }),

  write: (writer, packet) => {
    const { timestamp } = (packet as PingPacket).payload;
    writer.writeLong(timestamp);
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.Pong,
  state: State.Status,
  source: PacketSource.Server,

  read: (reader) => ({
    kind: PacketKind.Pong,
    payload: {
      timestamp: reader.readLong(),
    },
  }),

  write: (writer, packet) => {
    const { timestamp } = (packet as PongPacket).payload;
    writer.writeLong(timestamp);
  },
});
