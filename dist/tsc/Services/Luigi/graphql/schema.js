"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQL_SUBS_LUIGI_HANDLER = exports.GQL_QUERY_ALL_LUIGI_CHANNELS = void 0;
exports.GQL_QUERY_ALL_LUIGI_CHANNELS = [
    `query QueryAllSubsChannels { 
    channels(where: {daily_luigi: {_eq: true}}) { 
      channel_id
      daily_luigi
    } 
  }`,
    "channels",
];
const GQL_SUBS_LUIGI_HANDLER = (id, sub) => [
    `mutation { 
    update_channels_by_pk(pk_columns: {channel_id: "${id}"}, _set:{ daily_luigi: ${sub} }) { 
      daily_luigi 
    } 
  }`,
    "update_channels_by_pk",
];
exports.GQL_SUBS_LUIGI_HANDLER = GQL_SUBS_LUIGI_HANDLER;
//# sourceMappingURL=schema.js.map