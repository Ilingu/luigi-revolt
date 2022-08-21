import type { Message } from "revolt.js";
import { ConsoleLog } from "../../lib/types/enums";
import type { AvailableCmds } from "../../lib/types/types";
import { IsEmptyString, Log, Sleep } from "../../lib/utils";

const CmdRegex = /luigi!([a-zA-Z]+)(?: ([a-zA-Z ]+))?/im;
export const isValidCmd = (str: string) => {
  if (IsEmptyString(str)) return false;
  return CmdRegex.test(str);
};
export const isExistingCmd = (cmd: AvailableCmds): boolean => {
  if (cmd === "enable") return true;
  if (cmd === "disable") return true;
  return false;
};

export const ExtractCmd = (cmd: string): [AvailableCmds, string[]] | null => {
  if (!isValidCmd(cmd)) return null;

  const extractedRawCmd = cmd.match(CmdRegex);
  if (extractedRawCmd?.length !== 3) return null;

  const [instruction, arg] = extractedRawCmd.slice(1);
  const args = arg && arg.split(" ");

  if (!isExistingCmd(instruction as AvailableCmds)) return null;
  return [instruction as AvailableCmds, args || []];
};

export const ReplyError = async (message: Message, err: string) => {
  try {
    const m = await message.reply({ content: err });
    if (!m) return;
    await Sleep(5000, async () => await m.delete());
  } catch (err) {
    Log(err as string, ConsoleLog.FgRed);
  }
};
