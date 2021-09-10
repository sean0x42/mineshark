import { State } from "../state";
import Registry from "./registry";
import PacketReader from "../reader";
import { Packet, PacketBase, PacketSource } from "./types";
import { log } from "../logger";
import { readFromSpec } from "./spec/read";

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
      { id: packetReader.id, source, state },
      "Warn: Packet not listed in registry"
    );
    return null;
  }

  const specification = registryEntry.spec;

  const packet: PacketBase = {
    kind: registryEntry.kind,
    id: packetReader.id,
    isCompressed: packetReader.isCompressed,
    source,
    payload: readFromSpec(specification, packetReader),
  };

  return packet as Packet;
}
