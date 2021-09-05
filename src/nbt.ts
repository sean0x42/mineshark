export enum NbtType {
  End = 0,
  Byte,
  Short,
  Int,
  Long,
  Float,
  Double,
  ByteArray,
  String,
  List,
  Compound,
  // IntArray,
  // LongArray,
}

interface BaseNbtTag {
  kind: NbtType;
  name?: string;
  payload: unknown;
}

export interface NbtTagByte extends BaseNbtTag {
  kind: NbtType.Byte;
  payload: number;
}

export interface NbtTagShort extends BaseNbtTag {
  kind: NbtType.Short;
  payload: number;
}

export interface NbtTagInt extends BaseNbtTag {
  kind: NbtType.Int;
  payload: number;
}

export interface NbtTagLong extends BaseNbtTag {
  kind: NbtType.Long;
  payload: bigint;
}

export interface NbtTagFloat extends BaseNbtTag {
  kind: NbtType.Float;
  payload: number;
}

export interface NbtTagDouble extends BaseNbtTag {
  kind: NbtType.Double;
  payload: number;
}

export interface NbtTagByteArray extends BaseNbtTag {
  kind: NbtType.ByteArray;
  payload: Buffer;
}

export interface NbtTagString extends BaseNbtTag {
  kind: NbtType.String;
  payload: string;
}

export interface NbtTagList extends BaseNbtTag {
  kind: NbtType.List;
  payload: Array<NbtTag>;
}

export interface NbtTagCompound extends BaseNbtTag {
  kind: NbtType.Compound;
  payload: Record<string, NbtTag>;
}

// export interface NbtTagIntArray extends BaseNbtTag {
//   kind: NbtType.IntArray;
//   payload: Array<number>;
// }

// export interface NbtTagLongArray extends BaseNbtTag {
//   kind: NbtType.LongArray;
//   payload: Array<BigInt>;
// }

export type NbtTag =
  | NbtTagByte
  | NbtTagShort
  | NbtTagInt
  | NbtTagLong
  | NbtTagFloat
  | NbtTagDouble
  | NbtTagByteArray
  | NbtTagString
  | NbtTagList
  | NbtTagCompound;
// | NbtTagIntArray
// | NbtTagLongArray;
