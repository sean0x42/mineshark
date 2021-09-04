import { State } from "../state";
import Registry from "./registry";
import PacketReader from "../reader";
import PacketWriter from "./writer";
import { Packet, PacketBase, PacketKind, PacketSource } from "./types";
import { log } from "../logger";
import "./handshake";
import "./login";
import "./status";
import "./play";

export function readPacket(
  state: State,
  source: PacketSource,
  buffer: Buffer,
  useCompressedFormat: boolean
): Packet | null {
  const packetReader = new PacketReader(buffer, useCompressedFormat);

  // For some reason a GameJoin packet is coming instead of LoginSuccess... not really sure why.
  // This is a quick hack to work around that case.
  if (
    state === State.Login &&
    source === PacketSource.Server &&
    packetReader.id === 0x26
  ) {
    state = State.Play;
  }

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
    isCompressed: packetReader.isCompressed,
    source,
    ...registryEntry.read(packetReader),
  };

  return packet as Packet;
}

export function writePacket(
  packet: Packet,
  compressionThreshold?: number
): Buffer | null {
  const packetWriter = new PacketWriter(packet.kind, compressionThreshold);
  const packetConfig = Registry.getPacketByKind(packet.kind);

  if (packetConfig === undefined) {
    log.warn(`Warn: No packet writer is defined for kind ${packet.kind}`);
    return null;
  }

  log.trace({ packet }, "writing packet");
  packetConfig.write(packetWriter, packet);

  // TODO this is the wrong spot to be overiding this. Will not be able to
  // support `SetCompression` packets being sent down the line.
  if (packet.kind === PacketKind.SetCompression) {
    return packetWriter.toUncompressedPacketBuffer();
  } else {
    return packetWriter.toPacketBuffer(packet.isCompressed);
  }
}
