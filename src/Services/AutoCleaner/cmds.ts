import { ExecGraphQL } from "../../lib/db/nhost";
import {
  CreateChannel,
  IsChannelExist,
} from "../../lib/db/graphql/globalFuncs";
import { IsGqlReqSucceed } from "../../lib/db/utils";
import type { FunctionJob } from "../../lib/types/types";
import { GQL_UPDATE_IMG_EXPIRE_TIME } from "./graphql/schema";

export const UpdateExpireTime = async (
  chId: string,
  newTime: number | string
): Promise<FunctionJob> => {
  try {
    if (!(await IsChannelExist(chId))) {
      const { success } = await CreateChannel(chId, { expireTime: newTime });
      return {
        success,
        error: !success ? "cannot create root channel" : undefined,
      };
    }

    type RespType = { image_expire_time: number };
    const [UPDATE_IMG_EXPIRE_TIME, GqlFunc] = GQL_UPDATE_IMG_EXPIRE_TIME(
      chId,
      newTime
    );
    const resp = await ExecGraphQL<RespType>(UPDATE_IMG_EXPIRE_TIME);

    const success = IsGqlReqSucceed(resp, GqlFunc);
    if (
      resp?.data &&
      resp.data[GqlFunc]?.image_expire_time !== parseInt(newTime.toString())
    )
      return { success: false };

    return { success };
  } catch (err) {
    return { success: false };
  }
};
