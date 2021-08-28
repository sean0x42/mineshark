import produce from "immer";

import { log } from "../../logger";
import { Packet, PacketKind } from "../../packets/types";
import { NextFn } from "../types";

export default function customStatus(packet: Packet, next: NextFn): void {
  if (packet.kind !== PacketKind.Response) {
    return next();
  }

  const nextPacket = produce(packet, (draft) => {
    log.trace("Editing server status message");
    draft.payload.description.text = `[Mineshark] ${packet.payload.description.text}`;
  });

  next(nextPacket);
}
