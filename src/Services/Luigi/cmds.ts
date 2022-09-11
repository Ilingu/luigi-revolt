import { ExecGraphQL } from "../../lib/db/nhost";
import {
  CreateChannel,
  IsChannelExist,
} from "../../lib/db/graphql/globalFuncs";
import { ColorLog } from "../../lib/types/enums";
import { Log } from "../../lib/globalUtils";
import { IsGqlReqSucceed } from "../../lib/db/utils";
import type { ChannelShape, FunctionJob } from "../../lib/types/types";
import { GQL_SUBS_LUIGI_HANDLER } from "./graphql/schema";

/**
 * Ipml of enabling (subbing) to luigidaily command
 * @param {string} channelId
 */
export const EnableChannelCmd = async (
  channelId: string
): Promise<FunctionJob<ChannelShape>> => {
  Log(`Enabling Channel #${channelId}`, ColorLog.FgBlue);
  try {
    if (!(await IsChannelExist(channelId))) {
      const { success } = await CreateChannel(channelId, { isSub: true }); // create
      return {
        success,
        error: !success ? "cannot create root channel" : undefined,
      };
    }

    const [SUB_LUIGI, GqlFunc] = GQL_SUBS_LUIGI_HANDLER(channelId, true);

    const resp = await ExecGraphQL<ChannelShape>(SUB_LUIGI);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

/**
 * Ipml of disabling (unsub) to luigidaily command
 * @param {string} channelId
 */
export const DisableChannelCmd = async (
  channelId: string
): Promise<FunctionJob<ChannelShape>> => {
  Log(`Disabling Channel #${channelId}`, ColorLog.FgBlue);

  try {
    const [UNSUB_LUIGI, GqlFunc] = GQL_SUBS_LUIGI_HANDLER(channelId, false);

    const resp = await ExecGraphQL<ChannelShape>(UNSUB_LUIGI);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
