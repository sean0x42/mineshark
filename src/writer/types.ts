import PacketWriter from "./writer";
import { Packet, PacketKind } from "../packet";

export interface Writer {
  (writer: PacketWriter, packet: Packet): void;
}

export type WritersByKind = Partial<Record<PacketKind, Writer>>;
