import {
  NbtTag,
  NbtTagByteArray,
  NbtTagCompound,
  NbtTagList,
  NbtType,
} from "../nbt";
import PacketReader from "./packetReader";

interface PayloadReader {
  (): NbtTag["payload"];
}

/**
 * A packet reader that is also capable of reading NBT byte streams.
 */
class NbtPacketReader extends PacketReader {
  /**
   * Same as readString(), but NBT strings are prefixed by an unsigned short rather than a varint.
   */
  private readNbtString(): string {
    const size = this.readUnsignedShort();
    const value = this.buffer.toString(
      "utf-8",
      this.cursor,
      this.cursor + size
    );

    this.cursor += size;
    return value;
  }

  private readNamedNbtTag(kind: NbtType, payloadReader: PayloadReader): NbtTag {
    return {
      kind,
      name: this.readNbtString(),
      payload: payloadReader(),
    } as NbtTag;
  }

  private readNbtTag(kind: NbtType, payloadReader: PayloadReader): NbtTag {
    return {
      kind,
      name: undefined,
      payload: payloadReader(),
    } as NbtTag;
  }

  private parseTagChild(
    kind: NbtType,
    callback: (kind: NbtType, reader: PayloadReader) => NbtTag
  ): NbtTag {
    const readers: Partial<Record<NbtType, PayloadReader>> = {
      [NbtType.Byte]: () => this.readByte(),
      [NbtType.Short]: () => this.readShort(),
      [NbtType.Int]: () => this.readInt(),
      [NbtType.Long]: () => this.readLong(),
      [NbtType.Float]: () => this.readFloat(),
      [NbtType.Double]: () => this.readDouble(),
      [NbtType.ByteArray]: () => this.readNbtByteArrayPayload(),
      [NbtType.String]: () => this.readNbtString(),
      [NbtType.List]: () => this.readNbtListPayload(),
      [NbtType.Compound]: () => this.readNbtCompoundPayload(),
    };

    const reader = readers[kind];
    if (reader === undefined) {
      throw new Error(`Unsupported child type: ${kind}`);
    }

    return callback.call(this, kind, reader);
  }

  private readCompoundChild(): NbtTag {
    const kind = this.popByte();
    return this.parseTagChild(kind, this.readNamedNbtTag);
  }

  private readListChild(kind: NbtType): NbtTag {
    return this.parseTagChild(kind, this.readNbtTag);
  }

  private readNbtCompoundPayload(): NbtTagCompound["payload"] {
    const children: Record<string, NbtTag> = {};

    while (this.peekByte() !== NbtType.End) {
      const tag = this.readCompoundChild();
      children[tag.name!] = tag;
    }

    this.popByte(); // Pop the TAG_End byte.
    return children;
  }

  private readNbtListPayload(): NbtTagList["payload"] {
    const values = [];
    const kind = this.popByte();
    const length = this.readInt();

    for (let idx = 0; idx < length; idx++) {
      values.push(this.readListChild(kind));
    }

    return values;
  }

  /**
   * This differs from `readByteArrayWithLength` because the length here is encoded as an int.
   */
  private readNbtByteArrayPayload(): NbtTagByteArray["payload"] {
    const length = this.readInt();
    const arr = this.buffer.slice(this.cursor, this.cursor + length);
    this.cursor += length;
    return arr;
  }

  public readNbt(): NbtTag {
    return this.readCompoundChild();
  }

  public readNbtCompound(): NbtTagCompound {
    const tag = this.readCompoundChild();

    if (tag.kind !== NbtType.Compound) {
      throw new Error(`Expected NBT TAG_Compount. Found type id ${tag.kind}`);
    }

    return tag;
  }
}

export default NbtPacketReader;
