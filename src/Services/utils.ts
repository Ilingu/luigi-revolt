/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Message } from "revolt.js";
import { ConsoleLog } from "../lib/types/enums";
import type {
  AvailableBots,
  AvailableCmds,
  CmdsExecArgsShape,
  CmdShape,
  FunctionJob,
} from "../lib/types/types";
import { IsEmptyString, Log, Sleep } from "../lib/utils";

const CmdRegex = /(luigi|ac|anime)!([a-zA-Z]+)(?: ([a-zA-Z ]+))?/im;

export const isValidCmd = (str: string) => {
  if (IsEmptyString(str)) return false;
  return CmdRegex.test(str);
};

export const isExistingCmd = (
  bot: AvailableBots,
  cmd: AvailableCmds
): boolean => {
  // Luigi's Cmds
  if (bot === "luigi" && (cmd === "enable" || cmd === "disable")) return true;

  // AutoCleaner's Cmds
  if (bot === "ac" && cmd === "time") return true;

  // Anime updates' Cmds
  // none for the moment
  return false;
};

export const ExtractCmd = (cmd: string): [AvailableCmds, string[]] | null => {
  if (!isValidCmd(cmd)) return null;

  const extractedRawCmd = cmd.match(CmdRegex);
  if (extractedRawCmd?.length !== 4) return null;

  const [bot, instruction, arg] = extractedRawCmd.slice(1) as CmdShape;
  const args = arg && arg.split(" ");

  if (!isExistingCmd(bot, instruction)) return null;
  return [instruction, args || []];
};

export const ReplyTimeout = async (message: Message, err: string) => {
  try {
    const m = await message.reply({ content: err });
    if (!m) return;
    await Sleep(5000, async () => await m.delete());
  } catch (err) {
    Log(err as string, ConsoleLog.FgRed);
  }
};

export const Reply = async (message: Message, msg: string) => {
  try {
    return await message.reply({ content: msg });
  } catch (err) {
    Log(err as string, ConsoleLog.FgRed);
    return null;
  }
};

export const HandleCmdsExec = async <T = never>({
  CmdToExec,
  replyPipe,
  errorMsg,
  loadingMsg,
  successMsg,
}: CmdsExecArgsShape<T>): Promise<FunctionJob<T>> => {
  const RepondMsg = (msgType: string) =>
    !IsEmptyString(msgType) && Reply(replyPipe, msgType);

  try {
    const m = await RepondMsg(loadingMsg!);

    const cmdResp = await CmdToExec;

    m && m.delete();

    cmdResp.success && RepondMsg(successMsg!);
    !cmdResp.success && RepondMsg(errorMsg!);

    return cmdResp;
  } catch (err) {
    RepondMsg(errorMsg!);
    return { success: false };
  }
};
