export default class PacketReader {
  private length: number;
  id: number;
  cursor = 0;
  private buffer: Buffer;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.length = this.readVarInt();
    this.id = this.readVarInt();
  }

  public popByte(): number {
    return this.buffer[this.cursor++];
  }

  public isFinishedReading(): boolean {
    return this.cursor >= this.buffer.length;
  }

  public readBoolean(): boolean {
    return this.popByte() !== 0x0;
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

  // TODO improve this function
  public readUuid(): Buffer {
    // const partA = this.buffer.readBigUInt64BE(this.cursor);
    // const partB = this.buffer.readBigUInt64BE(this.cursor + 8);
    const arr = this.buffer.slice(this.cursor, this.cursor + 16);
    this.cursor += 16;
    return arr;
  }

  public readChat(): string {
    return this.readString();
  }

  public readByteArrayWithLength(): Buffer {
    const length = this.readVarInt();
    const arr = this.buffer.slice(this.cursor, this.cursor + length);
    this.cursor += length;
    return arr;
  }

  public readRemainingByteArray(): Buffer {
    const arr = this.buffer.slice(this.cursor, this.buffer.length);
    this.cursor = this.buffer.length;
    return arr;
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

      // Ignore the most significant bit. This determines whether more data is to come
      value |= (currentByte & 0b01111111) << bitOffset;

      bitOffset += 7;
    } while ((currentByte & 0b10000000) != 0);

    return value;
  }

  public readUnsignedShort(): number {
    const value = this.buffer.readUInt16BE(this.cursor);
    this.cursor += 2;
    return value;
  }

  public readLong(): bigint {
    const value = this.buffer.readBigInt64BE(this.cursor);
    this.cursor += 8;
    return value;
  }
}
