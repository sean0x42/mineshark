import { PacketKind, PacketSource } from "../packet";
import { ReadersBySource } from "./types";

interface PlayerSample {
  name: string;
  id: string;
}

interface ResponsePacket {
  version: {
    name: string;
    protocol: number
  },
  players: {
    max: number;
    online: number;
    sample: PlayerSample[]
  },
  description: {
    text: string
  },
  favicon?: string;
}

const readers: ReadersBySource = {
  [PacketSource.Client]: {
    0: () => ({
      kind: PacketKind.Request,
      payload: null,
    }),

    1: (reader) => ({
      kind: PacketKind.Ping,
      payload: {
        timestamp: reader.readLong(),
      },
    }),
  },

  [PacketSource.Server]: {
    0: (reader) => {
      const parsedResponse: ResponsePacket = JSON.parse(reader.readString());
      return {
        kind: PacketKind.Response,
        payload: {
          ...parsedResponse
        },
      }
    },

    1: (reader) => ({
      kind: PacketKind.Pong,
      payload: {
        timestamp: reader.readLong(),
      },
    }),
  },
};

export default readers;
