import type {
  GqlQuery,
  GraphQLCommand,
  ImageToDeleteShape,
} from "../../../lib/types/types";
import { QueryAllChannelImages, QueryChannelImgExpireTime } from "./funcs";

export const GQL_UPDATE_IMG_EXPIRE_TIME = (
  id: string,
  newTime: number | string
): GqlQuery => [
  `mutation {
    update_channels_by_pk(pk_columns: { channel_id: "${id}" }, _set:{ image_expire_time: ${newTime} }) {
      image_expire_time
    }
  }`,
  "update_channels_by_pk",
];

export const GQL_QUERY_IMG_EXPIRE_TIME = (
  id: string
): GraphQLCommand<number> => ({
  exec: () => QueryChannelImgExpireTime(id),
  cmd: [
    `query {
      channels_by_pk(channel_id: "${id}") {
        image_expire_time
      }
    }`,
    "channels_by_pk",
  ],
});

export const GQL_QUERY_ALL_IMAGES: GqlQuery = [
  `query QueryAllImagesToDelete {
    ImgToDelete {
      channel
      message_id
      expire_timestamp
    }
  }`,
  "ImgToDelete",
];

export const GQL_QUERY_ALL_CHANNEL_IMAGES = (
  id: string
): GraphQLCommand<ImageToDeleteShape[]> => ({
  exec: () => QueryAllChannelImages(id),
  cmd: [
    `query QueryAllChannelImages { 
      channels_by_pk(channel_id: "${id}") {
        ImagesToDelete  {
          channel
          message_id
          expire_timestamp
        }
      }
    }`,
    "channels_by_pk",
  ],
});

export const GQL_INSERT_CHANNEL_IMG = (
  chId: string,
  msgId: string,
  expireDate: number
): GqlQuery => [
  `mutation {
    insert_ImgToDelete_one(object: {channel: "${chId}", message_id: "${msgId}", expire_timestamp: ${expireDate}}) {
      expire_timestamp
    }
  }`,
  "insert_ImgToDelete_one",
];

export const GQL_DELETE_ALL_CHANNEL_IMAGES = (chId: string) => [
  `mutation {
    delete_ImgToDelete(where: {parent_channel: {channel_id: {_eq: "${chId}"}}}) {
      returning {
        message_id
      }
    }
  }`,
  "delete_ImgToDelete",
];

export const GQL_DELETE_IMAGES_BY_MESSAGES_IDS = (messagesIds: string[]) => [
  `mutation {
    delete_ImgToDelete(where: { message_id: { _in: ${JSON.stringify(
      messagesIds
    )} } }) {
      returning {
        message_id
      }
    }
  }`,
  "delete_ImgToDelete",
];
