import { ExecGraphQL } from "../nhost";
import {
  GQL_DELETE_CHANNEL,
  GQL_INSERT_CHANNEL,
  GQL_QUERY_CHANNEL,
} from "./globalSchema";
import type {
  FunctionJob,
  ChannelShape,
  CreateChannelOption,
} from "../../types/types";
import { IsGqlReqSucceed } from "../utils";

export const IsChannelExist = async (channelId: string): Promise<boolean> => {
  const [QUERY_CHANNEL, GqlFunc] = GQL_QUERY_CHANNEL(channelId);
  try {
    const resp = await ExecGraphQL(QUERY_CHANNEL);
    return IsGqlReqSucceed(resp, GqlFunc);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const CreateChannel = async (
  channelId: string,
  options?: CreateChannelOption
): Promise<FunctionJob<ChannelShape>> => {
  const [INSERT_CHANNEL, GqlFunc] = GQL_INSERT_CHANNEL(channelId, options).cmd;
  try {
    const resp = await ExecGraphQL<ChannelShape>(INSERT_CHANNEL);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false, error: typeof err === "string" ? err : undefined };
  }
};

export const DeleteChannel = async (
  channelId: string
): Promise<FunctionJob<ChannelShape>> => {
  const [DELETE_CHANNEL, GqlFunc] = GQL_DELETE_CHANNEL(channelId).cmd;
  try {
    const resp = await ExecGraphQL<ChannelShape>(DELETE_CHANNEL);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false, error: typeof err === "string" ? err : undefined };
  }
};
