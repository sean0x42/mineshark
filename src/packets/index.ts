import Registry from "./registry";
import PacketReader from "./reader";
import PacketWriter from "./writer";
import { State } from "../state";
import { Packet, PacketBase, PacketSource } from "./types";

export function readPacket(
  state: State,
  source: PacketSource,
  buffer: Buffer
): Packet | null {
  const packetReader = new PacketReader(buffer);
  const registryEntry = Registry.findPacket(packetReader.id, state, source);

  if (registryEntry === undefined) {
    console.warn(
      `Warn: No packet reader is defined for id ${packetReader.id}, source ${source}, state ${state}`
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
    console.warn(`Warn: No packet writer is defined for kind ${packet.kind}`);
    return null;
  }

  packetConfig.write(packetWriter, packet);
  return packetWriter.toBuffer();
}
