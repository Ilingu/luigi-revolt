import { ExecGraphQL } from "../../../lib/db/nhost";
import { IsGqlReqSucceed } from "../../../lib/db/utils";
import type { ChannelShape, FunctionJob } from "../../../lib/types/types";
import { GQL_QUERY_ALL_LUIGI_CHANNELS } from "./schema";

export const queryAllSubsChannels = async (): Promise<
  FunctionJob<ChannelShape[]>
> => {
  const [QUERY_ALL_LUIGI_CHANNELS, GqlFunc] = GQL_QUERY_ALL_LUIGI_CHANNELS;
  try {
    const resp = await ExecGraphQL<ChannelShape[]>(QUERY_ALL_LUIGI_CHANNELS);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
