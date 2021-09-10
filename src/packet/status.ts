import { State } from "../state";
import Registry from "./registry";
import { DataKind } from "./spec/types";
import { PacketKind, PacketSource } from "./types";
import { ResponsePacket } from "./types/status";

Registry.register({
  id: 0,
  kind: PacketKind.Request,
  state: State.Status,
  source: PacketSource.Client,
  spec: {},
});

Registry.register({
  id: 0,
  kind: PacketKind.Response,
  state: State.Status,
  source: PacketSource.Server,
  spec: {
    meta: {
      read: (reader) => {
        const jsonBody = reader.readString();
        return JSON.parse(jsonBody);
      },

      write: (writer, packet) => {
        const payload = JSON.stringify((packet as ResponsePacket).payload.meta);
        writer.writeString(payload);
      },
    },
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.Ping,
  state: State.Status,
  source: PacketSource.Client,
  spec: {
    timestamp: DataKind.Long,
  },
});

Registry.register({
  id: 1,
  kind: PacketKind.Pong,
  state: State.Status,
  source: PacketSource.Server,
  spec: {
    timestamp: DataKind.Long,
  },
});
