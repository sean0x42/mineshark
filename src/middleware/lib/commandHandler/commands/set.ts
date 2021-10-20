import { setFlag } from "../../../../store/flags";
import { Command, CommandConfig } from "../types";

const syntax = "/mineshark set <flag> <player>";

export const executeSet: Command = (
  args,
  { dispatch, useSelector, sendMessage }
) => {
  if (args.length < 4) {
    sendMessage(syntax);
    return;
  }

  const flag = args[2];
  const playerName = args[3];

  const addr = useSelector((state) => state.players.addrByName[playerName]) as
    | string
    | undefined;
  if (addr === undefined) {
    sendMessage(`Player not found: ${playerName}`);
    return;
  }

  dispatch(
    setFlag({
      name: playerName,
      flag,
    })
  );
  sendMessage(`Set ${flag} for ${playerName}`);
};

const config: CommandConfig = {
  aliases: ["set"],
  syntax,
  help: ["Set a flag for a particular player"],
  handler: executeSet,
};

export default config;
