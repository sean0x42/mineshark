import PacketWriter from "./writer";
import handshakeWriters from "./handshake";
import statusWriters from "./status";
import loginWriters from "./login";
import playWriters from "./play";
import { inferStateFromPacketKind, Packet } from "../packet";
import { State } from "../state";
import { WritersByKind } from "./types";

const writers: Record<State, WritersByKind> = {
  [State.Handshaking]: handshakeWriters,
  [State.Status]: statusWriters,
  [State.Login]: loginWriters,
  [State.Play]: playWriters,
};

export default function writePacket(packet: Packet): Buffer | null {
  const packetWriter = new PacketWriter(packet.kind);
  const state = inferStateFromPacketKind(packet.kind);

  const writer = writers[state][packet.kind];
  if (writer === undefined) {
    console.warn(`Warn: No packet writer is defined for kind ${packet.kind}`);
    return null;
  }

  writer(packetWriter, packet);

  return packetWriter.toBuffer();
}
