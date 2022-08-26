import { GQL_QUERY_ALL_LUIGI_CHANNELS } from "../../lib/db/graphql";
import { ExecGraphQL } from "../../lib/db/nhost";
import { IsGqlReqSucceed } from "../../lib/db/utils";
import { FunctionJob, LuigiChannelShape } from "../../lib/types/types";
import { SendLuigiMsg } from "./bot";

export const DailyLuigi = async () => {
  const LuigiOfTheDay = generateLuigiOfDay();

  const { success, data: subsChannels } = await queryAllSubsChannels();
  if (!success || !subsChannels || subsChannels.length <= 0) return;

  subsChannels.forEach((ch) => SendLuigiMsg(ch, LuigiOfTheDay));
};

const queryAllSubsChannels = async (): Promise<
  FunctionJob<LuigiChannelShape[]>
> => {
  const [QUERY_ALL_LUIGI_CHANNELS, GqlFunc] = GQL_QUERY_ALL_LUIGI_CHANNELS;
  try {
    const resp = await ExecGraphQL<LuigiChannelShape[]>(
      QUERY_ALL_LUIGI_CHANNELS
    );
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc] };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

const dateZero = new Date("08/25/2022").getTime();
const ONE_DAY_IN_MS = 86400000; // 1000 * 60 * 60 * 24
const generateLuigiOfDay = (): number => {
  const deltaTime = Date.now() - dateZero;
  const daysElapsed = Math.round(deltaTime / ONE_DAY_IN_MS);

  return daysElapsed;
};
