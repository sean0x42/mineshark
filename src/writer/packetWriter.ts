import zlib from "zlib";

import Registry from "../packets/registry";
import { PacketKind } from "../packets/types";
import ByteWriter from "./byteWriter";

export default class PacketWriter extends ByteWriter {
  protected useCompressedFormat: boolean;

  constructor(kind: PacketKind, useCompressedFormat = false) {
    super();

    this.useCompressedFormat = useCompressedFormat;

    const packetId = Registry.getPacketByKind(kind)?.id;
    if (packetId === undefined) {
      throw new Error(`No packet registered for kind ${kind}`);
    }

    this.writeVarInt(packetId);
  }

  public writeBoolean(value: boolean): this {
    this.push(Buffer.from([value ? 0x01 : 0x00]));
    return this;
  }

  protected computeVarInt(value: number): Buffer {
    let val = value;
    const bytes: number[] = [];

    do {
      let currentByte = val & 0b01111111;

      val >>>= 7;
      if (val !== 0) currentByte |= 0b10000000;

      bytes.push(currentByte);
    } while (val !== 0);

    return Buffer.from(bytes);
  }

  public writeVarInt(value: number): this {
    const buffer = this.computeVarInt(value);
    this.push(buffer);

    return this;
  }

  public writeByte(value: number): this {
    const buffer = Buffer.allocUnsafe(1);
    buffer.writeInt8(value);
    this.push(buffer);

    return this;
  }

  public writeUnsignedByte(value: number): this {
    this.push(Buffer.from([value]));
    return this;
  }

  public writeShort(value: number): this {
    const buffer = Buffer.allocUnsafe(2);
    buffer.writeInt16BE(value);
    this.push(buffer);

    return this;
  }

  public writeUnsignedShort(value: number): this {
    const buffer = Buffer.allocUnsafe(2);
    buffer.writeUInt16BE(value);
    this.push(buffer);

    return this;
  }

  public writeInt(value: number): this {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeInt32BE(value);
    this.push(buffer);

    return this;
  }

  public writeLong(value: bigint): this {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeBigInt64BE(value);
    this.push(buffer);

    return this;
  }

  public writeFloat(value: number): this {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeFloatBE(value);
    this.push(buffer);

    return this;
  }

  public writeDouble(value: number): this {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeDoubleBE(value);
    this.push(buffer);

    return this;
  }

  public writeString(value: string): this {
    const buffer = Buffer.from(value, "utf-8");

    this.writeVarInt(buffer.length);
    this.push(buffer);

    return this;
  }

  // TODO improve
  public writeChat(chat: string): this {
    return this.writeString(chat);
  }

  // TODO improve this function
  public writeUuid(uuid: Buffer): this {
    this.push(uuid);

    return this;
  }

  public writeIdentifierArray(arr: string[]): this {
    this.writeVarInt(arr.length);

    arr.forEach((value) => this.writeString(value));

    return this;
  }

  public writeByteArrayWithLength(buffer: Buffer): this {
    this.writeVarInt(buffer.length);
    this.push(buffer);

    return this;
  }

  public writeByteArray(buffer: Buffer): this {
    this.push(buffer);

    return this;
  }

  public toCompressedPacketBuffer(isCompressed: boolean): Buffer {
    const dataLength = this.computeVarInt(isCompressed ? this.length : 0);
    const buffer = isCompressed ? zlib.deflateSync(this.buffer) : this.buffer;
    const packetLength = this.computeVarInt(dataLength.length + buffer.length);

    return Buffer.concat([packetLength, dataLength, buffer]);
  }

  public toUncompressedPacketBuffer(): Buffer {
    const dataLength = this.computeVarInt(this.length);
    return Buffer.concat([dataLength, this.buffer]);
  }

  public toPacketBuffer(isCompressed: boolean): Buffer {
    return this.useCompressedFormat
      ? this.toCompressedPacketBuffer(isCompressed)
      : this.toUncompressedPacketBuffer();
  }
}
