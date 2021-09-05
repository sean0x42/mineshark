import {
  NbtTag,
  NbtTagByte,
  NbtTagByteArray,
  NbtTagCompound,
  NbtTagDouble,
  NbtTagFloat,
  NbtTagInt,
  NbtTagList,
  NbtTagLong,
  NbtTagShort,
  NbtTagString,
  NbtType,
} from "../nbt";
import PacketWriter from "./packetWriter";

interface PayloadWriter {
  (): void;
}

export default class NbtPacketWriter extends PacketWriter {
  /**
   * Same as writeString(), but NBT strings are prefixed by an unsigned short rather than a varint.
   */
  public writeNbtString(value: string): this {
    const buffer = Buffer.from(value);
    this.writeUnsignedShort(buffer.length);
    this.push(buffer);

    return this;
  }

  public writeNbt(tag: NbtTag): this {
    this.writeCompoundChild(tag);
    return this;
  }

  private writeCompoundChild(tag: NbtTag): void {
    this.writeUnsignedByte(tag.kind);
    this.writeNbtString(tag.name!);
    this.writePayloadForTag(tag);
  }

  private writeListChild(tag: NbtTag): void {
    this.writePayloadForTag(tag);
  }

  private writePayloadForTag(tag: NbtTag): void {
    const writers: Partial<Record<NbtType, PayloadWriter>> = {
      [NbtType.Byte]: () => this.writeByte((tag as NbtTagByte).payload),
      [NbtType.Short]: () => this.writeShort((tag as NbtTagShort).payload),
      [NbtType.Int]: () => this.writeInt((tag as NbtTagInt).payload),
      [NbtType.Long]: () => this.writeLong((tag as NbtTagLong).payload),
      [NbtType.Float]: () => this.writeFloat((tag as NbtTagFloat).payload),
      [NbtType.Double]: () => this.writeDouble((tag as NbtTagDouble).payload),

      [NbtType.ByteArray]: () => {
        const arr = (tag as NbtTagByteArray).payload;
        this.writeInt(arr.length);
        this.push(arr);
      },

      [NbtType.String]: () =>
        this.writeNbtString((tag as NbtTagString).payload),

      [NbtType.List]: () => {
        const arr = (tag as NbtTagList).payload;
        const kind = arr[0].kind;
        this.writeUnsignedByte(kind);
        this.writeInt(arr.length);

        arr.forEach((child) => this.writeListChild(child));
      },

      [NbtType.Compound]: () => {
        const children = (tag as NbtTagCompound).payload;

        Object.values(children).forEach((tag) => this.writeCompoundChild(tag));

        this.writeUnsignedByte(0);
      },
    };

    const writer = writers[tag.kind as NbtType];
    if (writer === undefined) {
      throw new Error(`Unsupported NBT writer type: ${tag.kind}`);
    }

    writer();
  }
}
