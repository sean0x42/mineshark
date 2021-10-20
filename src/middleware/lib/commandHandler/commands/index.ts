import { CommandConfig } from "../types";
import helpCommand from "./help";
import setCommand from "./set";

const commands: CommandConfig[] = [helpCommand, setCommand];

export { helpCommand, setCommand };
export default commands;
