import { State } from "../state";
import PacketSpecification from "./spec";
import { PacketKind, PacketSource } from "./types";

export interface RegistryEntry {
  kind: PacketKind;
  source: PacketSource;
  id: number;
  state: State;
  spec: PacketSpecification;
}

type PacketsByKind = Partial<Record<PacketKind, RegistryEntry>>;
type PacketIndex = Record<
  State,
  Record<PacketSource, Record<number, PacketKind>>
>;

class PacketRegistry {
  private packetsByKind: PacketsByKind = {};
  private packetIndex: PacketIndex = {
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

  public register(packet: RegistryEntry): void {
    this.packetsByKind[packet.kind] = packet;
    this.packetIndex[packet.state][packet.source][packet.id] = packet.kind;
  }

  public getPacketByKind(kind: PacketKind): RegistryEntry | undefined {
    return this.packetsByKind[kind];
  }

  public findPacket(
    id: number,
    state: State,
    source: PacketSource
  ): RegistryEntry | undefined {
    const kind = this.packetIndex[state][source][id];
    return kind ? this.getPacketByKind(kind) : undefined;
  }
}

const Registry = new PacketRegistry();
export default Registry;
