import { PacketKind, PacketSource } from "../packet";
import { ReadersBySource } from "./types";

const readers: ReadersBySource = {
  [PacketSource.Client]: {},

  [PacketSource.Server]: {},
};

export default readers;
