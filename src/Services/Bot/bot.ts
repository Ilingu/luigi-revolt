import { Client } from "revolt.js";
import { ConsoleLog } from "../../lib/types/enums";
import { IsEmptyString, Log } from "../../lib/utils";
import { DisableChannelCmd, EnableChannelCmd } from "./cmds";
import { ExtractCmd, isValidCmd, ReplyError } from "./utils";

const client = new Client();

client.on("ready", async () => {
  Log(`Logged in as ${client?.user?.username}!`);
});

client.on("message", async (message) => {
  const MessageID = message._id;
  const ChannelID = message.channel_id;

  console.log(MessageID, ChannelID, message?.content);

  if (message.attachments && message.attachments.length > 0) {
    // Db lib
  }

  const includeCmd =
    !IsEmptyString(message?.content) && message.content?.startsWith("luigi!");
  if (includeCmd) {
    if (!isValidCmd(message.content as string))
      return ReplyError(message, "❌ Invalid Command");

    // type NoExtractError = Exclude<ReturnType<typeof ExtractCmd>, null>;
    const cmd = ExtractCmd(message.content as string);
    if (!cmd) return ReplyError(message, "❌ Command Not Found");

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

        return;
      }
      if (instruction === "disable") {
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

        return;
      }
      return ReplyError(message, "❌ Invalid Command instruction");
    } catch (err) {
      return ReplyError(message, "❌ Fatal Error When Executing this Command");
    }
  }
});
client.on("channel/delete", () => {
  // Delete all
});

const StartBotProcess = () => {
  if (process.env.BOT_TOKEN)
    client
      .loginBot(process.env.BOT_TOKEN)
      .then(() => Log("🔒 Crediential OK", ConsoleLog.FgGreen));
  else Log("Cannot Login Into Bot", ConsoleLog.FgRed);
};
export default StartBotProcess;
