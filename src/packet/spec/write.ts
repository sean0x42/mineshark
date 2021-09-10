import { NbtTagCompound } from "../../nbt";
import NbtPacketWriter from "../../writer";
import { Packet } from "../types";
import {
  ComplexProperty,
  DataKind,
  isComplexProperty,
  isCustomProperty,
  PacketSpecification,
} from "./types";

function writeComplexProperty(
  value: unknown,
  property: ComplexProperty,
  writer: NbtPacketWriter
): void {
  const mapping: Record<DataKind, () => void> = {
    [DataKind.Boolean]: () => writer.writeBoolean(value as boolean),
    [DataKind.VarInt]: () => writer.writeVarInt(value as number),
    [DataKind.Byte]: () => writer.writeByte(value as number),
    [DataKind.UnsignedByte]: () => writer.writeUnsignedByte(value as number),
    [DataKind.Short]: () => writer.writeShort(value as number),
    [DataKind.UnsignedShort]: () => writer.writeUnsignedShort(value as number),
    [DataKind.Int]: () => writer.writeInt(value as number),
    [DataKind.Long]: () => writer.writeLong(value as bigint),
    [DataKind.Float]: () => writer.writeFloat(value as number),
    [DataKind.Double]: () => writer.writeDouble(value as number),
    [DataKind.String]: () => writer.writeString(value as string),
    [DataKind.Chat]: () => writer.writeChat(value as string),
    [DataKind.Uuid]: () => writer.writeUuid(value as Buffer),
    [DataKind.ByteArrayWithLength]: () =>
      writer.writeByteArrayWithLength(value as Buffer),
    [DataKind.ByteArray]: () => writer.writeByteArray(value as Buffer),
    [DataKind.NbtCompound]: () => writer.writeNbt(value as NbtTagCompound),
  };

  return mapping[property.kind]();
}

export function writeFromSpec(
  specification: PacketSpecification,
  writer: NbtPacketWriter,
  packet: Packet
): void {
  Object.entries(specification).forEach(([name, property]) => {
    if (isCustomProperty(property)) {
      property.write(writer, packet);
      return;
    }

    // Deliberately opting out of type information here. We have to rely on the packet specs being correct.
    const value = (packet.payload as Record<string, unknown>)[name];
    const spec = isComplexProperty(property) ? property : { kind: property };

    if (spec.optional && value === null) {
      return;
    }

    writeComplexProperty(value, spec, writer);
  });
}
