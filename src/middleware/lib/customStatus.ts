import produce from "immer";

import { log } from "../../logger";
import { Packet, PacketKind } from "../../packet/types";
import { NextFn } from "../types";

export default function customStatus(packet: Packet, next: NextFn): void {
  if (packet.kind !== PacketKind.Response) {
    return next();
  }

  const nextPacket = produce(packet, (draft) => {
    log.trace("Editing server status message");
    draft.payload.meta.description.text = `[Mineshark] ${packet.payload.meta.description.text}`;
  });

  next(nextPacket);
}
