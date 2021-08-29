import zlib from "zlib";

import Registry from "./registry";
import { PacketKind } from "./types";

export default class PacketWriter {
  private buffer = Buffer.allocUnsafe(0);
  private length = 0;
  private compressionThreshold?: number;

  constructor(kind: PacketKind, compressionThreshold?: number) {
    this.compressionThreshold = compressionThreshold;

    const packetId = Registry.getPacketByKind(kind)?.id;

    if (packetId === undefined) {
      throw new Error(`No packet registered for kind ${kind}`);
    }

    this.writeVarInt(packetId);
  }

  private push(buffer: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, buffer]);
    this.length += buffer.length;
  }

  private computeVarInt(value: number): Buffer {
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

  public writeVarInt(value: number): PacketWriter {
    const buffer = this.computeVarInt(value);
    this.push(buffer);

    return this;
  }

  public writeBoolean(value: boolean): PacketWriter {
    this.push(Buffer.from([value ? 0x01 : 0x00]));

    return this;
  }

  public writeString(value: string): PacketWriter {
    const buffer = Buffer.from(value, "utf-8");

    this.writeVarInt(buffer.length);
    this.push(buffer);

    return this;
  }

  // TODO improve this function
  public writeUuid(uuid: Buffer): PacketWriter {
    this.push(uuid);

    return this;
  }

  public writeChat(chat: string): PacketWriter {
    return this.writeString(chat);
  }

  public writeByteArrayWithLength(buffer: Buffer): PacketWriter {
    this.writeVarInt(buffer.length);
    this.push(buffer);

    return this;
  }

  public writeByteArray(buffer: Buffer): PacketWriter {
    this.push(buffer);

    return this;
  }

  public writeUnsignedShort(value: number): PacketWriter {
    const buffer = Buffer.allocUnsafe(2);
    buffer.writeUInt16BE(value);
    this.push(buffer);

    return this;
  }

  public writeLong(value: bigint): PacketWriter {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeBigInt64BE(value);
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
    const isUsingCompressedFormat =
      this.compressionThreshold !== undefined && this.compressionThreshold > 0;

    return isUsingCompressedFormat
      ? this.toCompressedPacketBuffer(isCompressed)
      : this.toUncompressedPacketBuffer();
  }
}
