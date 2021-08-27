import { State } from "../state";
import Registry from "./registry";
import PacketReader from "./reader";
import PacketWriter from "./writer";
import { Packet, PacketBase, PacketSource } from "./types";
import { log } from "../logger";
import "./handshake";
import "./login";
import "./status";

export function readPacket(
  state: State,
  source: PacketSource,
  buffer: Buffer
): Packet | null {
  const packetReader = new PacketReader(buffer);
  const registryEntry = Registry.findPacket(packetReader.id, state, source);

  if (registryEntry === undefined) {
    log.warn(
      { source, state },
      `Warn: No packet reader is defined for id ${packetReader.id}`
    );
    return null;
  }

  const packet: PacketBase = {
    id: packetReader.id,
    source,
    ...registryEntry.read(packetReader),
  };

  return packet as Packet;
}

export function writePacket(packet: Packet): Buffer | null {
  const packetWriter = new PacketWriter(packet.kind);
  const packetConfig = Registry.getPacketByKind(packet.kind);

  if (packetConfig === undefined) {
    log.warn(`Warn: No packet writer is defined for kind ${packet.kind}`);
    return null;
  }

  log.trace({ packet }, "writing packet");
  packetConfig.write(packetWriter, packet);
  return packetWriter.toBuffer();
}
