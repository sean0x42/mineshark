import { Packet, PacketKind, PacketSource } from "../packet/types";

export const createSimpleMessagePacket = (
  template: Packet,
  message: string
): Packet => ({
  id: 0x0f,
  clientId: template.clientId,
  kind: PacketKind.ChatMessage,
  source: PacketSource.Server,
  isCompressed: template.isCompressed,
  payload: {
    chat: {
      text: message,
    },
    position: 1,
    sender: "",
  },
});
