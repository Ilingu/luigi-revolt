import {
  GQL_DELETE_LUIGI_CHANNEL,
  GQL_INSERT_LUIGI_CHANNEL,
} from "../../lib/db/graphql";
import { ExecGraphQL } from "../../lib/db/nhost";
import { CreateChannel, IsChannelExist } from "../../lib/db/ServerGql";
import { ConsoleLog } from "../../lib/types/enums";
import { FunctionJob, LuigiChannelShape } from "../../lib/types/types";
import { Log } from "../../lib/globalUtils";
import { IsGqlReqSucceed } from "../../lib/db/utils";

export const EnableChannelCmd = async (
  channelId: string
): Promise<FunctionJob<LuigiChannelShape>> => {
  Log(`Enabling Channel #${channelId}`, ConsoleLog.FgBlue);
  try {
    if (!(await IsChannelExist(channelId))) {
      const { success } = await CreateChannel(channelId);
      if (!success)
        return { success: false, error: "cannot create root channel" };
    }

    const [INSERT_LUIGI_CHANNEL, GqlFunc] = GQL_INSERT_LUIGI_CHANNEL(channelId);

    const resp = await ExecGraphQL<LuigiChannelShape>(INSERT_LUIGI_CHANNEL);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const DisableChannelCmd = async (
  channelId: string
): Promise<FunctionJob<LuigiChannelShape>> => {
  Log(`Disabling Channel #${channelId}`, ConsoleLog.FgBlue);

  try {
    const [DELETE_LUIGI_CHANNEL, GqlFunc] = GQL_DELETE_LUIGI_CHANNEL(channelId);

    const resp = await ExecGraphQL<LuigiChannelShape>(DELETE_LUIGI_CHANNEL);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
