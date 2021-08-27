import clonePacket from "../../clonePacket";
import { log } from "../../logger";
import { PacketKind } from "../../packets/types";
import { Middleware } from "../types";

const customStatus: Middleware = (packet, { next }) => {
  if (packet.kind !== PacketKind.Response) {
    return next();
  }

  log.trace("Editing server status message");

  const copy = clonePacket(packet);
  copy.payload.description.text = `[Mineshark] ${packet.payload.description.text}`;
  next(copy);
};

export default customStatus;
