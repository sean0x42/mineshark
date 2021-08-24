import PacketReader from "./reader";
import { Packet, PacketSource } from "../packet";

export interface Reader {
  (reader: PacketReader): Pick<Packet, "kind"> & {
    payload: Record<string, unknown> | null;
  };
}

export interface ReadersByPacketId {
  [key: number]: Reader;
}

export interface ReadersBySource {
  [PacketSource.Client]: ReadersByPacketId;
  [PacketSource.Server]: ReadersByPacketId;
}
