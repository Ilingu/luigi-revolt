import type { GqlQuery } from "../../../lib/types/types";

/**
 * Query all the sub channels to luigi
 * @param {string} id
 * @param {boolean} sub
 * @returns {GqlQuery} [GqlCmd, GqlFunc]
 */
export const GQL_QUERY_ALL_LUIGI_CHANNELS = [
  `query QueryAllSubsChannels { 
    channels(where: {daily_luigi: {_eq: true}}) { 
      channel_id
      daily_luigi
    } 
  }`,
  "channels",
];

/**
 * Sub or unsub to luigi command
 * @param {string} id
 * @param {boolean} sub
 * @returns {GqlQuery} [GqlCmd, GqlFunc]
 */
export const GQL_SUBS_LUIGI_HANDLER = (id: string, sub: boolean): GqlQuery => [
  `mutation { 
    update_channels_by_pk(pk_columns: {channel_id: "${id}"}, _set:{ daily_luigi: ${sub} }) { 
      daily_luigi 
    } 
  }`,
  "update_channels_by_pk",
];
