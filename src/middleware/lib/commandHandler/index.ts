import { isStringChatComponent } from "../../../chat";
import { Packet, PacketKind } from "../../../packet/types";
import { canExecuteCommands } from "../../../store/permissions";
import { MiddlewareActions } from "../../types";
import parseCommand from "./parser";
import { CommandConfig } from "./types";
import commands from "./commands";
import { generateHelp } from "./commands/help";

export const commandAliases = ["/mineshark", "/shark", "/ms"];

export function findCommandConfig(
  commandName: string
): CommandConfig | undefined {
  return commands.find((command) =>
    command.aliases.includes(commandName.toLowerCase())
  );
}

export default function commandHandler(
  packet: Packet,
  actions: MiddlewareActions
): void {
  const { next, useSelector, sendMessage } = actions;

  if (
    packet.kind !== PacketKind.ChatMessage ||
    !isStringChatComponent(packet.payload.chat)
  ) {
    return next();
  }

  const message = packet.payload.chat.text;
  const messageLower = message.toLowerCase();

  const isMinesharkCommand = commandAliases.some((alias) =>
    messageLower.startsWith(alias)
  );
  if (!isMinesharkCommand) {
    return next();
  }

  const hasPermission = useSelector(
    canExecuteCommands(packet.clientId)
  ) as boolean;
  if (!hasPermission) {
    sendMessage("You don't have permission to use this command.");
    return;
  }

  const args = parseCommand(message);

  if (args.length === 1) {
    sendMessage(...generateHelp());
    return;
  }

  const commandName = args[1];
  const config = findCommandConfig(commandName);

  if (config === undefined) {
    sendMessage(`Unknown command: ${commandName}`);
    return;
  }

  config.handler(args, actions);
}
