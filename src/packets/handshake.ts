import Registry from "./registry";
import HandshakePacket from "./types/handshake";
import { State } from "../state";
import { PacketKind, PacketSource } from "./types";

Registry.register({
  id: 0,
  kind: PacketKind.Handshake,
  state: State.Handshake,
  source: PacketSource.Client,

  read: (reader) => ({
    kind: PacketKind.Handshake,
    payload: {
      protocolVersion: reader.readVarInt(),
      host: reader.readString(),
      port: reader.readUnsignedShort(),
      nextState: reader.readVarInt(),
    },
  }),

  write: (writer, packet) => {
    const { protocolVersion, host, port, nextState } = (
      packet as HandshakePacket
    ).payload;
    writer
      .writeVarInt(protocolVersion)
      .writeString(host)
      .writeUnsignedShort(port)
      .writeVarInt(nextState);
  },
});
