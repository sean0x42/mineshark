import PacketReader from "./reader";
import PacketWriter from "./writer";
import { State } from "../state";
import { Packet, PacketKind, PacketSource } from "./types";

interface ReadImplementor {
  (reader: PacketReader): Pick<Packet, "kind" | "payload">;
}

interface WriteImplementor {
  (writer: PacketWriter, packet: Packet): void;
}

interface RegisteredPacket {
  kind: PacketKind;
  source: PacketSource;
  id: number;
  state: State;
  read: ReadImplementor;
  write: WriteImplementor;
}

class PacketRegistry {
  private packetsByKind: Partial<Record<PacketKind, RegisteredPacket>> = {};

  private packetIndex: Record<
    State,
    Record<PacketSource, Record<number, PacketKind>>
  > = {
    [State.Handshake]: {
      [PacketSource.Client]: {},
      [PacketSource.Server]: {},
    },
    [State.Status]: {
      [PacketSource.Client]: {},
      [PacketSource.Server]: {},
    },
    [State.Login]: {
      [PacketSource.Client]: {},
      [PacketSource.Server]: {},
    },
    [State.Play]: {
      [PacketSource.Client]: {},
      [PacketSource.Server]: {},
    },
  };

  public register(packet: RegisteredPacket): void {
    this.packetsByKind[packet.kind] = packet;
    this.packetIndex[packet.state][packet.source][packet.id] = packet.kind;
  }

  public getPacketByKind(kind: PacketKind): RegisteredPacket | undefined {
    return this.packetsByKind[kind];
  }

  public findPacket(
    id: number,
    state: State,
    source: PacketSource
  ): RegisteredPacket | undefined {
    const kind = this.packetIndex[state][source][id];
    return kind ? this.getPacketByKind(kind) : undefined;
  }
}

const Registry = new PacketRegistry();
export default Registry;
