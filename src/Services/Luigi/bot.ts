import { Client } from "revolt.js";
import { ConsoleLog } from "../../lib/types/enums";
import { IsEmptyString, Log } from "../../lib/utils";
import { DisableChannelCmd, EnableChannelCmd } from "./cmds";
import { ExtractCmd, isValidCmd, ReplyTimeout } from "../utils";

const luigi = new Client();
const PREFIX = "luigi!";

luigi.on("ready", async () => {
  Log(`Logged in as ${luigi?.user?.username}!`);
});

luigi.on("message", async (message) => {
  const ChannelID = message.channel_id;

  const includeCmd =
    !IsEmptyString(message?.content) && message.content?.startsWith(PREFIX);
  if (includeCmd) {
    if (!isValidCmd(message.content as string))
      return ReplyTimeout(message, "❌ Invalid Command");

    const cmd = ExtractCmd(message.content as string);
    if (!cmd) return ReplyTimeout(message, "❌ Command Not Found");

    const [instruction] = cmd;
    try {
      if (instruction === "enable") {
        const m = await message.reply({
          content: "Enabling this Channel ⏳",
        });

        const { success } = await EnableChannelCmd(ChannelID);
        m && m.delete();
        if (success)
          message.reply({
            content: "This Channel is Enabled ✅",
          });
        else
          message.reply({
            content: "Failed to Enable this Channel ❌",
          });
      } else if (instruction === "disable") {
        const m = await message.reply({ content: "Disabling this Channel ⏳" });

        const { success } = await DisableChannelCmd(ChannelID);
        m && m.delete();

        if (success)
          message.reply({
            content: "This Channel is Disabled ✅",
          });
        else
          message.reply({
            content: "Failed to Disable this Channel ❌",
          });
      } else ReplyTimeout(message, "❌ Invalid Command instruction");
    } catch (err) {
      return ReplyTimeout(
        message,
        "❌ Fatal Error When Executing this Command"
      );
    }
  }
});
luigi.on("channel/delete", async (channel_id) => {
  await DisableChannelCmd(channel_id); // disabling channel
});

const StartLuigiBot = () => {
  if (process.env.LUIGI_BOT_TOKEN)
    luigi
      .loginBot(process.env.LUIGI_BOT_TOKEN)
      .then(() => Log("🔒 Luigi Crediential OK", ConsoleLog.FgGreen));
  else Log("Cannot Login Into Luigi Bot", ConsoleLog.FgRed);
};
export default StartLuigiBot;
