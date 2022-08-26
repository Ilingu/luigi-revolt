type GqlQuery = [string, string];

export const GQL_QUERY_CHANNEL = (id: string): GqlQuery => [
  `query QueryChannel { channels_by_pk(channel_id: "${id}") { channel_id } }`,
  "channels_by_pk",
];

export const GQL_INSERT_CHANNEL = (id: string): GqlQuery => [
  `mutation { insert_channels_one(object: { channel_id: "${id}" }) { channel_id } }`,
  "insert_channels_one",
];

export const GQL_DELETE_CHANNEL = (id: string): GqlQuery => [
  `mutation { delete_channels_by_pk(channel_id: "${id}") { channel_id } }`,
  "delete_channels_by_pk",
];

export const GQL_INSERT_LUIGI_CHANNEL = (id: string): GqlQuery => [
  `mutation {insert_luigi_subscribed_chans_one(object: {channel: "${id}", subscribed: true})}`,
  "insert_luigi_subscribed_chans_one",
];

export const GQL_DELETE_LUIGI_CHANNEL = (id: string): GqlQuery => [
  `mutation { delete_luigi_subscribed_chans_by_pk(channel: "${id}") { channel } }`,
  "delete_luigi_subscribed_chans_by_pk",
];

export const GQL_QUERY_ALL_LUIGI_CHANNELS = [
  `query QueryAllSubsChannels { luigi_subscribed_chans { channel subscribed } }`,
  "luigi_subscribed_chans",
];
