import NbtPacketReader from "../../reader";
import NbtPacketWriter from "../../writer";
import { Packet } from "../types";

export enum DataKind {
  Boolean,
  VarInt,
  Byte,
  UnsignedByte,
  Short,
  UnsignedShort,
  Int,
  Long,
  Float,
  Double,
  String,
  Chat,
  Uuid,
  ByteArrayWithLength,
  ByteArray,
  NbtCompound,
}

export interface ComplexProperty {
  kind: DataKind;
  optional?: boolean;
}

export interface ReadImplementor {
  (reader: NbtPacketReader): unknown;
}

export interface WriteImplementor {
  (writer: NbtPacketWriter, packet: Packet): void;
}

export interface CustomProperty {
  read: ReadImplementor;
  write: WriteImplementor;
}

export function isCustomProperty(prop: Property): prop is CustomProperty {
  return (prop as CustomProperty).read !== undefined;
}

export function isComplexProperty(prop: Property): prop is ComplexProperty {
  return (prop as ComplexProperty).kind !== undefined;
}

type Property = DataKind | ComplexProperty | CustomProperty;

export interface PacketSpecification {
  [property: string]: Property;
}
