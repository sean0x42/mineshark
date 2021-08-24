import PacketReader from "./reader";
import handshakeReaders from "./handshake";
import statusReaders from "./status";
import loginReaders from "./login";
import playReaders from "./play";
import { State } from "../state";
import { ReadersBySource } from "./types";
import { Packet, PacketSource } from "../packet";

const readers: Record<State, ReadersBySource> = {
  [State.Handshaking]: handshakeReaders,
  [State.Status]: statusReaders,
  [State.Login]: loginReaders,
  [State.Play]: playReaders,
};

export default function readPacket(
  state: State,
  source: PacketSource,
  buffer: Buffer
): Packet | null {
  const packetReader = new PacketReader(buffer);

  const reader = readers[state][source][packetReader.id];
  if (reader === undefined) {
    console.warn(
      `Warn: No packet reader is defined for id ${packetReader.id}, source ${source}, state ${state}`
    );
    return null;
  }

  return {
    id: packetReader.id,
    source,
    ...reader(packetReader),
  };
}
