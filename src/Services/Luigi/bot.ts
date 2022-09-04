/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from "revolt.js";
import { ColorLog } from "../../lib/types/enums";
import { Log } from "../../lib/globalUtils";
import { DisableChannelCmd, EnableChannelCmd } from "./cmds";
import { HandleCmdsExec, ParseMsgCmd, Reply, ReplyTimeout } from "../utils";
import type { ChannelShape } from "../../lib/types/types";

const luigi = new Client();
const PREFIX = "luigi!";
let isUp = false;

luigi.on("ready", async () => {
  isUp = true;
  Log(`Logged in as ${luigi?.user?.username}!`, ColorLog.FgBlue, true);
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
      HandleCmdsExec<ChannelShape>({
        CmdToExec: EnablePromise,
        replyPipe: message,
        loadingMsg: "Enabling this Channel ⏳",
        successMsg: "This Channel is Enabled ✅",
        errorMsg: "Failed to Enable this Channel ❌",
      });
    } else if (instruction === "disable") {
      const DisablePromise = DisableChannelCmd(ChannelID);
      HandleCmdsExec<ChannelShape>({
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

const luigirEmojiId = ":01GBDS81FEJ7XKFXZNFDY0FJ2C:";
export const SendLuigiDailyMsg = async (
  { channel_id, daily_luigi }: ChannelShape,
  LuigiOfDay: number
) => {
  if (!daily_luigi) return;

  try {
    const ch = await luigi.channels.fetch(channel_id);
    ch.sendMessage({
      embeds: [
        {
          icon_url:
            "https://autumn.revolt.chat/avatars/TREZKXil5xWmZ0XI3XwFg7dTqXObYFODOZOY00-gZ2?max_side=16",
          title: "💚 Luigi of the Day!",
          description: `## ${luigirEmojiId} Luigi #$${LuigiOfDay}$`,
          colour: "#f1c40f",
        },
      ],
    });
  } catch (err) {
    Log(
      `Failed to send DailyLuigi on Channel ${channel_id} ❌`,
      ColorLog.FgRed
    );
  }
};

const StartLuigiBot = () => {
  if (process.env.LUIGI_BOT_TOKEN)
    luigi
      .loginBot(process.env.LUIGI_BOT_TOKEN)
      .then(() => Log("🔒 Luigi Crediential OK", ColorLog.FgGreen));
  else Log("Cannot Login Into Luigi Bot", ColorLog.FgRed);
};
luigi.on("dropped", () => {
  isUp = false;
  setTimeout(() => {
    if (!isUp) StartLuigiBot();
  }, 10_000);
});

export default StartLuigiBot;
