/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Message } from "revolt.js";
import { ColorLog } from "../lib/types/enums";
import type {
  AvailableBots,
  AvailableCmds,
  CmdsExecArgsShape,
  CmdShape,
  FunctionJob,
  ParsedCmdShape,
} from "../lib/types/types";
import { IsEmptyString, Log, Sleep } from "../lib/globalUtils";

/* Bots Utils */

export const ReplyTimeout = async (message: Message, err: string) => {
  try {
    const m = await message.reply({ content: err });
    if (!m) return;
    await Sleep(5000, async () => await m.delete());
  } catch (err) {
    Log(err as string, ColorLog.FgRed);
  }
};

export const Reply = async (message: Message, msg: string) => {
  try {
    return await message.reply({ content: msg });
  } catch (err) {
    Log(err as string, ColorLog.FgRed);
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

  let m: Awaited<ReturnType<typeof RepondMsg>>;
  try {
    m = await RepondMsg(loadingMsg!); // loading message sent
    const cmdResp = await CmdToExec; // Exec Gql query/mutation

    m && m.delete(); // response back: delete loading msg

    cmdResp.success && RepondMsg(successMsg!); // success msg sent
    !cmdResp.success && RepondMsg(errorMsg!); // error msg sent

    return cmdResp;
  } catch (err) {
    m && m.delete(); // response back: delete loading msg
    RepondMsg(errorMsg!);
    return { success: false };
  }
};

/* Cmds Utils */

const cmdRegex = /(luigi|ac|anime)!([a-zA-Z]+)(?: ([a-zA-Z0-9 ]+))?/im;

export const ParseMsgCmd = (
  content: string,
  PREFIX: string
): FunctionJob<ParsedCmdShape> => {
  const includeCmd = !IsEmptyString(content) && content?.startsWith(PREFIX);
  if (!includeCmd) return { success: false };

  if (!isValidCmd(content))
    return { success: false, error: "❌ Invalid Command" };

  const cmd = extractCmd(content);
  if (!cmd) return { success: false, error: "❌ Command Not Found" };

  return { success: true, data: cmd };
};

const isValidCmd = (str: string) => {
  if (IsEmptyString(str)) return false;
  return cmdRegex.test(str);
};

const extractCmd = (cmd: string): ParsedCmdShape | null => {
  if (!isValidCmd(cmd)) return null;

  const extractedRawCmd = cmd.match(cmdRegex);
  if (extractedRawCmd?.length !== 4) return null;

  const [bot, instruction, arg] = extractedRawCmd.slice(1) as CmdShape;
  const args = arg && arg.split(" ");

  if (!IsExistingCmd(bot, instruction)) return null;
  return [instruction, args || []];
};

export const IsExistingCmd = (
  bot: AvailableBots,
  cmd: AvailableCmds
): boolean => {
  // Luigi's Cmds
  if (bot === "luigi" && (cmd === "enable" || cmd === "disable")) return true;

  // AutoCleaner's Cmds
  if (bot === "ac" && cmd === "time") return true;
  if (bot === "ac" && cmd === "index") return true;

  // Anime updates' Cmds
  // none for the moment
  return false;
};
