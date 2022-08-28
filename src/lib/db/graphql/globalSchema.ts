import type {
  ChannelShape,
  CreateChannelOption,
  GqlQuery,
  GraphQLCommand,
} from "../../types/types";
import { CreateChannel, DeleteChannel } from "./globalFuncs";

export const GQL_QUERY_CHANNEL = (id: string): GqlQuery => [
  `query QueryChannel { 
    channels_by_pk(channel_id: "${id}") { 
      channel_id 
    } 
  }`,
  "channels_by_pk",
];

export const GQL_INSERT_CHANNEL = (
  id: string,
  options?: CreateChannelOption
): GraphQLCommand<ChannelShape> => ({
  exec: () => CreateChannel(id, options),
  cmd: [
    `mutation { 
      insert_channels_one(object: { channel_id: "${id}", daily_luigi: ${!!options?.isSub}, image_expire_time: ${
      options?.expireTime || 432000000
    } }) { 
        channel_id 
      } 
    }`,
    "insert_channels_one",
  ],
});

export const GQL_DELETE_CHANNEL = (
  id: string
): GraphQLCommand<ChannelShape> => ({
  exec: () => DeleteChannel(id),
  cmd: [
    `mutation { 
      delete_channels_by_pk(channel_id: "${id}") { 
        channel_id 
      } 
    }`,
    "delete_channels_by_pk",
  ],
});
