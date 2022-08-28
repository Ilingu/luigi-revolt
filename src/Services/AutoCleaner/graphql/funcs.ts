import { ExecGraphQL } from "../../../lib/db/nhost";
import { IsGqlReqSucceed } from "../../../lib/db/utils";
import type { FunctionJob, ImageToDeleteShape } from "../../../lib/types/types";
import {
  GQL_DELETE_ALL_CHANNEL_IMAGES,
  GQL_INSERT_CHANNEL_IMG,
  GQL_QUERY_ALL_CHANNEL_IMAGES,
  GQL_QUERY_IMG_EXPIRE_TIME,
} from "./schema";

export const QueryChannelImgExpireTime = async (
  channelId: string
): Promise<FunctionJob<number>> => {
  try {
    const [QUERY_IMG_EXPIRE_TIME, GqlFunc] =
      GQL_QUERY_IMG_EXPIRE_TIME(channelId).cmd;

    type RespType = { image_expire_time: number };
    const resp = await ExecGraphQL<RespType>(QUERY_IMG_EXPIRE_TIME);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return {
      success,
      data: resp?.data && (resp.data[GqlFunc]?.image_expire_time || 432000000),
    };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const QueryAllChannelImages = async (
  channelId: string
): Promise<FunctionJob<ImageToDeleteShape[]>> => {
  try {
    const [QUERY_CHANNEL_IMGS, GqlFunc] =
      GQL_QUERY_ALL_CHANNEL_IMAGES(channelId).cmd;

    type RespType = { ImagesToDelete: ImageToDeleteShape[] };
    const resp = await ExecGraphQL<RespType>(QUERY_CHANNEL_IMGS);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    return { success, data: resp?.data && resp.data[GqlFunc]?.ImagesToDelete };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const InsertChannelImg = async (
  channelId: string,
  msgId: string,
  msgCreatedAt: number
): Promise<FunctionJob> => {
  try {
    // eslint-disable-next-line prefer-const
    let { success, data: imgExpireTime } = await QueryChannelImgExpireTime(
      channelId
    );
    if (!success || !imgExpireTime) imgExpireTime = 432000000;

    const [INSERT_CHANNEL_IMG] = GQL_INSERT_CHANNEL_IMG(
      channelId,
      msgId,
      msgCreatedAt + imgExpireTime
    );

    const { success: inserted } = await ExecGraphQL(INSERT_CHANNEL_IMG);
    return { success: inserted };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const DeleteAllChannelImages = async (
  channelId: string
): Promise<FunctionJob> => {
  try {
    const [DELETE_ALL_CHANNEL_IMAGES] =
      GQL_DELETE_ALL_CHANNEL_IMAGES(channelId);

    const { success } = await ExecGraphQL(DELETE_ALL_CHANNEL_IMAGES);
    return { success };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
