import Registry from "./registry";
import PacketWriter from "../writer";
import { Packet, PacketKind } from "./types";
import { log } from "../logger";
import { writeFromSpec } from "./spec/write";

export function writePacket(
  packet: Packet,
  useCompressedFormat: boolean
): Buffer | null {
  const packetWriter = new PacketWriter(packet.kind, useCompressedFormat);
  const registryEntry = Registry.getPacketByKind(packet.kind);

  if (registryEntry === undefined) {
    log.warn(`Warn: No packet writer is defined for kind ${packet.kind}`);
    return null;
  }

  log.trace({ packet }, "writing packet");
  const specification = registryEntry.spec;
  writeFromSpec(specification, packetWriter, packet);

  // TODO this is the wrong spot to be overiding this. Will not be able to
  // support `SetCompression` packets being sent down the line.
  if (packet.kind === PacketKind.SetCompression) {
    return packetWriter.toUncompressedPacketBuffer();
  } else {
    return packetWriter.toPacketBuffer(packet.isCompressed);
  }
}
