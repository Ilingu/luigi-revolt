/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from "revolt.js";
import { ColorLog } from "../../lib/types/enums";
import { Log } from "../../lib/globalUtils";
import { DisableChannelCmd, EnableChannelCmd } from "./cmds";
import { HandleCmdsExec, ParseMsgCmd, Reply, ReplyTimeout } from "../utils";
import { LuigiChannelShape } from "../../lib/types/types";

const luigi = new Client();
const PREFIX = "luigi!";

luigi.on("ready", async () => {
  Log(`Logged in as ${luigi?.user?.username}!`);
});

luigi.on("message", async (message) => {
  const ChannelID = message.channel_id;

  const {
    success: isCmd,
    data: cmd,
    error,
  } = ParseMsgCmd(message.content!, PREFIX);

  if (isCmd && cmd) {
    const [instruction] = cmd;
    if (instruction === "enable") {
      const EnablePromise = EnableChannelCmd(ChannelID);
      HandleCmdsExec<LuigiChannelShape>({
        CmdToExec: EnablePromise,
        replyPipe: message,
        loadingMsg: "Enabling this Channel ⏳",
        successMsg: "This Channel is Enabled ✅",
        errorMsg: "Failed to Enable this Channel ❌",
      });
    } else if (instruction === "disable") {
      const DisablePromise = DisableChannelCmd(ChannelID);
      HandleCmdsExec<LuigiChannelShape>({
        CmdToExec: DisablePromise,
        replyPipe: message,
        loadingMsg: "Disabling this Channel ⏳",
        successMsg: "This Channel is Disabled ✅",
        errorMsg: "Failed to Disable this Channel ❌",
      });
    } else ReplyTimeout(message, "❌ Invalid Command instruction");
  }
  error && Reply(message, error);
});
luigi.on("channel/delete", async (channel_id) => {
  await DisableChannelCmd(channel_id); // disabling channel
});

const luigirEmojiId = ":01GBDS81FEJ7XKFXZNFDY0FJ2C:";
export const SendLuigiMsg = async (
  { channel, subscribed }: LuigiChannelShape,
  LuigiOfDay: number
) => {
  if (!subscribed) return;

  const ch = await luigi.channels.fetch(channel);
  ch.sendMessage({ content: `# ${luigirEmojiId} Luigi $${LuigiOfDay}$ !` });
};

const StartLuigiBot = () => {
  if (process.env.LUIGI_BOT_TOKEN)
    luigi
      .loginBot(process.env.LUIGI_BOT_TOKEN)
      .then(() => Log("🔒 Luigi Crediential OK", ColorLog.FgGreen));
  else Log("Cannot Login Into Luigi Bot", ColorLog.FgRed);
};
export default StartLuigiBot;
