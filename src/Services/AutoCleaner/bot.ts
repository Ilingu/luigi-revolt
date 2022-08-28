/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from "revolt.js";
import { ColorLog } from "../../lib/types/enums";
import { Log } from "../../lib/globalUtils";
import { HandleCmdsExec, ParseMsgCmd, Reply, ReplyTimeout } from "../utils";
import { CreateChannel, DeleteChannel } from "../../lib/db/graphql/globalFuncs";
import { DeleteAllChannelImages, InsertChannelImg } from "./graphql/funcs";
import { ChannelShape, FunctionJob } from "../../lib/types/types";
import { GQL_DELETE_IMAGES_BY_MESSAGES_IDS } from "./graphql/schema";
import { ExecGraphQL } from "../../lib/db/nhost";
import { UpdateExpireTime } from "./cmds";

const ac = new Client();
const PREFIX = "ac!";

ac.on("ready", async () => {
  Log(`Logged in as ${ac?.user?.username}!`);

  // Index All Channel In DB
  ac.channels.forEach(({ _id: chId }) => {
    CreateChannel(chId); // We create a channel representation in the DB
  });
});

ac.on("channel/create", async (ch) => {
  const { success } = await CreateChannel(ch._id); // We create a channel representation in the DB

  const m = await ch.sendMessage({
    content: success
      ? "Channel Successfully Indexed ✅"
      : "Couldn't index this channel ❌",
  });
  setTimeout(() => m.delete(), 10_000);
});
ac.on("channel/delete", async (chId) => {
  const success = await DeleteAllChannelImages(chId); // First, we delete all the image linked to the channel in the DB
  success && (await DeleteChannel(chId)); // Second, we delete the channel itself in the DB
});

ac.on("message", async (message) => {
  const MessageID = message._id;
  const ChannelID = message.channel_id;

  if (message.attachments && message.attachments.length > 0) {
    const { success } = await InsertChannelImg(
      ChannelID,
      MessageID,
      message?.createdAt || Date.now()
    ); // Add the image to the deletion queue

    if (!success) {
      await message.delete(); // if error, delete the image since we don't want the iomage to be never deleted
      await message.channel?.sendMessage(
        "### This image was deleted by @AutoCleaner, because I couldn't add it to the deletion queue. Try again."
      ); // Tell the user that an error occur
      return;
    }
  }

  const {
    success: isCmd,
    data: cmd,
    error,
  } = ParseMsgCmd(message.content!, PREFIX);

  if (isCmd && cmd) {
    const [instruction, args] = cmd;

    if (instruction === "time") {
      if (args.length !== 1 || isNaN(parseInt(args[0])))
        return ReplyTimeout(
          message,
          'Invalid args ❌. E.g: "ac!<command> <arg1> <arg2>"'
        );

      const UpdateETPromise = UpdateExpireTime(ChannelID, args[0]);
      HandleCmdsExec<ChannelShape>({
        CmdToExec: UpdateETPromise,
        replyPipe: message,
        loadingMsg: "Updating this channel expire time ⏳",
        successMsg: "Channel expire time updated Successfully ✅",
        errorMsg: "Couldn't Update this channel expire time ❌",
      });
    } else if (instruction === "index") {
      const CreateChPromise = CreateChannel(ChannelID);
      HandleCmdsExec<ChannelShape>({
        CmdToExec: CreateChPromise,
        replyPipe: message,
        loadingMsg: "Indexing this Channel ⏳",
        successMsg: "Channel Successfully Indexed ✅",
        errorMsg:
          "Couldn't index this channel ❌ (hint: this channel is possibly already indexed in the DB) ",
      });
    } else ReplyTimeout(message, "❌ Invalid Command instruction");
  }
  error && Reply(message, error);
});
ac.on("message/delete", async (msgId, msg) => {
  if (msg && msg.attachments && msg.attachments.length > 0) {
    const [DELETE_IMAGES] = GQL_DELETE_IMAGES_BY_MESSAGES_IDS([msgId]);
    await ExecGraphQL(DELETE_IMAGES);
  }
});

export const acDeleteImages = async (
  chId: string,
  msgIds: string[]
): Promise<FunctionJob> => {
  try {
    const ch = await ac.channels.fetch(chId);
    await ch.deleteMessages(msgIds);
    return { success: true };
  } catch (err) {
    console.log(err);
    Log(`Failed to delete messages on Channel ${chId} ❌`, ColorLog.FgRed);
    return { success: false };
  }
};

const StartACBot = () => {
  if (process.env.AUTOCLEANER_BOT_TOKEN)
    ac.loginBot(process.env.AUTOCLEANER_BOT_TOKEN).then(() =>
      Log("🔒 AC Crediential OK", ColorLog.FgGreen)
    );
  else Log("Cannot Login Into AC Bot", ColorLog.FgRed);
};
export default StartACBot;
