import { MiddlewareActions } from "../../types";

export type CommandActions = MiddlewareActions;

export interface Command {
  (args: string[], actions: CommandActions): void;
}

export interface CommandConfig {
  aliases: string[];
  syntax: string;
  help: string[];
  handler: Command;
}
