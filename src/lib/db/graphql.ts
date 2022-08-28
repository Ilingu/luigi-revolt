type GqlQuery = [string, string];

export const GQL_QUERY_CHANNEL = (id: string): GqlQuery => [
  `query QueryChannel { 
    channels_by_pk(channel_id: "${id}") { 
      channel_id 
    } 
  }`,
  "channels_by_pk",
];

export const GQL_INSERT_CHANNEL = (id: string, sub = false): GqlQuery => [
  `mutation { 
    insert_channels_one(object: { channel_id: "${id}", daily_luigi: ${sub} }) { 
      channel_id 
    } 
  }`,
  "insert_channels_one",
];

export const GQL_DELETE_CHANNEL = (id: string): GqlQuery => [
  `mutation { 
    delete_channels_by_pk(channel_id: "${id}") { 
      channel_id 
    } 
  }`,
  "delete_channels_by_pk",
];

export const GQL_SUBS_LUIGI_HANDLER = (id: string, sub: boolean): GqlQuery => [
  `mutation { 
    update_channels_by_pk(pk_columns: {channel_id: "${id}"}, _set:{ daily_luigi: ${sub} }) { 
      daily_luigi 
    } 
  }`,
  "update_channels_by_pk",
];

export const GQL_QUERY_ALL_LUIGI_CHANNELS = [
  `query QueryAllSubsChannels { 
    channels(where: {daily_luigi: {_eq: true}}) { 
      channel_id
      daily_luigi
    } 
  }`,
  "channels",
];

export const GQL_QUERY_ALL_CHANNELS_IMG = [
  `query QueryAllChannelImages { 
    channels {
      ImagesToDelete  {
        channel
        message_id
        expire_timestamp
      }
    }
  }`,
  "channels",
];

export const GQL_QUERY_CHANNEL_IMG = (id: string) => [
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
];
