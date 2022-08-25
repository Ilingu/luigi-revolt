/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from "revolt.js";
import { ConsoleLog } from "../../lib/types/enums";
import { Log } from "../../lib/utils";
import { ParseMsgCmd, Reply } from "../utils";

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
  // deletes channel in DB
});

ac.on("message", async (message) => {
  const MessageID = message._id;
  const ChannelID = message.channel_id;

  if (message.attachments && message.attachments.length > 0) {
    // DB
  }

  const {
    success: isCmd,
    data: cmd,
    error,
  } = ParseMsgCmd(message.content!, PREFIX);

  if (isCmd && cmd) {
    const [instruction] = cmd;
    if (instruction === "time") {
      // db
    }
  }
  error && Reply(message, error);
});

const StartACBot = () => {
  if (process.env.AUTOCLEANER_BOT_TOKEN)
    ac.loginBot(process.env.AUTOCLEANER_BOT_TOKEN).then(() =>
      Log("🔒 AC Crediential OK", ConsoleLog.FgGreen)
    );
  else Log("Cannot Login Into AC Bot", ConsoleLog.FgRed);
};
export default StartACBot;
