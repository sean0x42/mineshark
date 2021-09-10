import { State } from "../state";
import Registry from "./registry";
import { PacketKind, PacketSource } from "./types";
import { DataKind } from "./spec/types";

Registry.register({
  id: 0,
  kind: PacketKind.Handshake,
  state: State.Handshake,
  source: PacketSource.Client,
  spec: {
    protocolVersion: DataKind.VarInt,
    host: DataKind.String,
    port: DataKind.UnsignedShort,
    nextState: DataKind.VarInt,
  }
});
