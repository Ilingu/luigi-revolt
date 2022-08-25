import { Client } from "revolt.js";
import { ConsoleLog } from "../../lib/types/enums";
import { IsEmptyString, Log } from "../../lib/utils";
import { ExtractCmd, isValidCmd, ReplyTimeout } from "../utils";

const ac = new Client();
const PREFIX = "ac!";

ac.on("ready", async () => {
  Log(`Logged in as ${ac?.user?.username}!`);
  // Index All Channel In DB
  // client.channels.forEach(c =>{
  //   c._id
  // })
});
ac.on("channel/delete", () => {
  // deletes channal in DB
});

ac.on("message", async (message) => {
  const MessageID = message._id;
  const ChannelID = message.channel_id;

  if (message.attachments && message.attachments.length > 0) {
    // Db lib
  }

  const includeCmd =
    !IsEmptyString(message?.content) && message.content?.startsWith(PREFIX);
  if (includeCmd) {
    if (!isValidCmd(message.content as string))
      return ReplyTimeout(message, "❌ Invalid Command");

    const cmd = ExtractCmd(message.content as string);
    if (!cmd) return ReplyTimeout(message, "❌ Command Not Found");

    const [instruction] = cmd;
    try {
      if (instruction === "time") {
        return;
      }
      ReplyTimeout(message, "❌ Invalid Command instruction");
    } catch (err) {
      return ReplyTimeout(
        message,
        "❌ Fatal Error When Executing this Command"
      );
    }
  }
});

const StartACBot = () => {
  if (process.env.AUTOCLEANER_BOT_TOKEN)
    ac.loginBot(process.env.AUTOCLEANER_BOT_TOKEN).then(() =>
      Log("🔒 AC Crediential OK", ConsoleLog.FgGreen)
    );
  else Log("Cannot Login Into AC Bot", ConsoleLog.FgRed);
};
export default StartACBot;
