import { commandAliases, findCommandConfig } from "..";
import { Command, CommandConfig } from "../types";
import commands from ".";

export function generateHelp(): string[] {
  const commandsList = commands.map((command) => command.syntax);

  return [
    "Mineshark help",
    `Aliases: ${commandAliases.join(", ")}`,
    "Commands",
    ...commandsList,
  ];
}

export const executeHelp: Command = (args, { sendMessage }) => {
  if (args.length >= 3) {
    const config = findCommandConfig(args[2]);

    if (config === undefined) {
      sendMessage(`Unknown command: ${args[2]}`);
      return;
    }

    sendMessage(
      config.syntax,
      `Aliases: ${config.aliases.join(", ")}`,
      ...config.help
    );
    return;
  }

  sendMessage(...generateHelp());
};

const config: CommandConfig = {
  aliases: ["help", "h"],
  syntax: "/mineshark help [command]",
  help: [
    "Prints this help text.",
    "Optionally a command name can be provided to print help for a specific command.",
  ],
  handler: executeHelp,
};

export default config;
