import { getPacketId, PacketKind } from "../packet";

function isBuffer(value: Buffer | number[]): value is Buffer {
  return (value as Buffer).write !== undefined;
}

export default class PacketWriter {
  private buffer = Buffer.allocUnsafe(0);
  private length = 0;

  constructor(kind: PacketKind) {
    const packetId = getPacketId(kind);
    this.writeVarInt(packetId);
  }

  private push(buffer: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, buffer])
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

  public writeString(value: string): PacketWriter {
    const buffer = Buffer.from(value, "utf-8");

    this.writeVarInt(buffer.length);
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

  public toBuffer(): Buffer {
    const length = this.computeVarInt(this.length);
    return Buffer.concat([length, this.buffer])
  }
}
