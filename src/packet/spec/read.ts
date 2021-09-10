import NbtPacketReader from "../../reader";
import {
  ComplexProperty,
  DataKind,
  isComplexProperty,
  isCustomProperty,
  PacketSpecification,
} from "./types";

function readComplexProperty(
  property: ComplexProperty,
  reader: NbtPacketReader
): unknown {
  const mapping: Record<DataKind, () => void> = {
    [DataKind.Boolean]: () => reader.readBoolean(),
    [DataKind.VarInt]: () => reader.readVarInt(),
    [DataKind.Byte]: () => reader.readByte(),
    [DataKind.UnsignedByte]: () => reader.readUnsignedByte(),
    [DataKind.Short]: () => reader.readShort(),
    [DataKind.UnsignedShort]: () => reader.readUnsignedShort(),
    [DataKind.Int]: () => reader.readInt(),
    [DataKind.Long]: () => reader.readLong(),
    [DataKind.Float]: () => reader.readFloat(),
    [DataKind.Double]: () => reader.readDouble(),
    [DataKind.String]: () => reader.readString(),
    [DataKind.Chat]: () => reader.readChat(),
    [DataKind.Uuid]: () => reader.readUuid(),
    [DataKind.ByteArrayWithLength]: () => reader.readByteArrayWithLength(),
    [DataKind.ByteArray]: () => reader.readRemainingByteArray(),
    [DataKind.NbtCompound]: () => reader.readNbtCompound(),
  };

  return mapping[property.kind]();
}

export function readFromSpec(
  specification: PacketSpecification,
  reader: NbtPacketReader
) {
  const payload: Record<string, unknown> = {};

  Object.entries(specification).forEach(([name, property]) => {
    if (isCustomProperty(property)) {
      payload[name] = property.read(reader);
      return;
    }

    const spec = isComplexProperty(property) ? property : { kind: property };

    if (spec.optional && reader.isFinishedReading()) {
      payload[name] = null;
      return;
    }

    payload[name] = readComplexProperty(spec, reader);
  });

  return payload;
}
