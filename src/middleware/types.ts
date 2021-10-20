import { Packet } from "../packet/types";
import { AppDispatch, AppSelector } from "../store";

export interface NextFn {
  (packet?: Packet): void;
}

export interface EmitPacket {
  (packet: Packet): void;
}

export type UseSelector<Selected = unknown> = (
  selector: AppSelector<Selected>
) => Selected;

export interface SendMessage {
  (...messages: string[]): void;
}

export interface MiddlewareActions {
  next: NextFn;
  emit: EmitPacket;
  dispatch: AppDispatch;
  useSelector: UseSelector;
  sendMessage: SendMessage;
}

export interface Middleware {
  (packet: Packet, actions: MiddlewareActions): void;
}
