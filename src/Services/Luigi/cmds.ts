import { ExecGraphQL } from "../../lib/nhost";
import { ConsoleLog } from "../../lib/types/enums";
import { FunctionJob } from "../../lib/types/types";
import { Log } from "../../lib/utils";

export const EnableChannelCmd = async (
  channelId: string
): Promise<FunctionJob> => {
  Log(`Enabling Channel #${channelId}`, ConsoleLog.FgBlue);
  // DB
  const INSERT_CHANNEL = `mutation {
  insert_channels_one(object: {channel_id: "${channelId}", subscibed: true}) {
    channel_id
  }
}`;
  try {
    return await ExecGraphQL(INSERT_CHANNEL);
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const DisableChannelCmd = async (
  channelId: string
): Promise<FunctionJob> => {
  Log(`Disabling Channel #${channelId}`, ConsoleLog.FgBlue);
  // DB
  const DELETE_CHANNEL = `mutation {
  delete_channels_by_pk(channel_id: "${channelId}") {
    ImgToDeletes {
      message_id
    }
  }
}`;
  try {
    return await ExecGraphQL(DELETE_CHANNEL);
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
