import { ConsoleLog } from "../../lib/types/enums";
import { FunctionJob } from "../../lib/types/types";
import { Log } from "../../lib/utils";

export const EnableChannelCmd = async (
  channelId: string
): Promise<FunctionJob> => {
  Log(`Enabling Channel #${channelId}`, ConsoleLog.FgBlue);
  // DB
  return { success: true };
};
export const DisableChannelCmd = async (
  channelId: string
): Promise<FunctionJob> => {
  Log(`Disabling Channel #${channelId}`, ConsoleLog.FgBlue);
  // DB
  return { success: true };
};
