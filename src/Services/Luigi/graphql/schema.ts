import type { GqlQuery } from "../../../lib/types/types";

export const GQL_QUERY_ALL_LUIGI_CHANNELS = [
  `query QueryAllSubsChannels { 
    channels(where: {daily_luigi: {_eq: true}}) { 
      channel_id
      daily_luigi
    } 
  }`,
  "channels",
];

export const GQL_SUBS_LUIGI_HANDLER = (id: string, sub: boolean): GqlQuery => [
  `mutation { 
    update_channels_by_pk(pk_columns: {channel_id: "${id}"}, _set:{ daily_luigi: ${sub} }) { 
      daily_luigi 
    } 
  }`,
  "update_channels_by_pk",
];
