import zlib from "zlib";

import { Chat } from "../chat/types";
import ByteReader from "./byteReader";

class PacketReader extends ByteReader {
  id: number;
  isCompressed = false;

  constructor(buffer: Buffer, useCompressedFormat = false) {
    super(buffer);

    // Read and dispose of packet length. We won't be using it here.
    this.readVarInt();

    if (useCompressedFormat) {
      const dataLength = this.readVarInt();

      if (dataLength !== 0) {
        this.buffer = zlib.inflateSync(buffer.slice(this.cursor));
        this.cursor = 0;
        this.isCompressed = true;
      }
    }

    this.id = this.readVarInt();
  }

  public readBoolean(): boolean {
    return this.popByte() !== 0x0;
  }

  public readVarInt(): number {
    let value = 0;
    let bitOffset = 0;
    let currentByte;

    do {
      if (bitOffset === 35) {
        throw "VarInt exceeds maximum length";
      }

      currentByte = this.popByte();
      value |= (currentByte & 0b01111111) << bitOffset;
      bitOffset += 7;
    } while ((currentByte & 0b10000000) != 0);

    return value;
  }

  public readByte(): number {
    return this.buffer.readInt8(this.cursor++);
  }

  public readUnsignedByte(): number {
    return this.popByte();
  }

  public readShort(): number {
    const value = this.buffer.readInt16BE(this.cursor);
    this.cursor += 2;
    return value;
  }

  public readUnsignedShort(): number {
    const value = this.buffer.readUInt16BE(this.cursor);
    this.cursor += 2;
    return value;
  }

  public readInt(): number {
    const value = this.buffer.readInt32BE(this.cursor);
    this.cursor += 4;
    return value;
  }

  public readLong(): bigint {
    const value = this.buffer.readBigInt64BE(this.cursor);
    this.cursor += 8;
    return value;
  }

  public readFloat(): number {
    const value = this.buffer.readFloatBE(this.cursor);
    this.cursor += 4;
    return value;
  }

  public readDouble(): number {
    const value = this.buffer.readDoubleBE(this.cursor);
    this.cursor += 8;
    return value;
  }

  public readString(): string {
    const size = this.readVarInt();
    const value = this.buffer.toString(
      "utf-8",
      this.cursor,
      this.cursor + size
    );

    this.cursor += size;

    return value;
  }

  public readChat(): Chat {
    const contents = this.readString();
    return JSON.parse(contents);
  }

  // TODO improve this function
  public readUuid(): Buffer {
    // const partA = this.buffer.readBigUInt64BE(this.cursor);
    // const partB = this.buffer.readBigUInt64BE(this.cursor + 8);
    const arr = this.buffer.slice(this.cursor, this.cursor + 16);
    this.cursor += 16;
    return arr;
  }

  public readIdentifierArray(): string[] {
    const length = this.readVarInt();
    const values = [];

    for (let i = 0; i < length; i++) {
      values.push(this.readString());
    }

    return values;
  }

  public readByteArrayWithLength(): Buffer {
    const length = this.readVarInt();
    const arr = this.buffer.slice(this.cursor, this.cursor + length);
    this.cursor += length;
    return arr;
  }

  public readRemainingByteArray(): Buffer {
    const arr = this.buffer.slice(this.cursor);
    this.cursor = this.buffer.length;
    return arr;
  }
}

export default PacketReader;
