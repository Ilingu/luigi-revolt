import { NhostClient } from "@nhost/nhost-js";
import { FunctionJob } from "./types/types";

const nhost = new NhostClient({
  // backendUrl: `https://${process.env.DB_URL}.nhost.run`,
  subdomain: process.env.DB_URL,
  region: "eu-central-1",
  adminSecret: process.env.DB_ADMIN,
});

export const ExecGraphQL = async <T = never>(
  gql: string
): Promise<FunctionJob<T>> => {
  try {
    const { data, error } = await nhost.graphql.request<T>(gql);
    if (error || !data) return { success: false };

    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

/*
channels
  channel_id_1
    attachment: [{ message_id, expire_timestamp }]
  channel_id_2
    attachment: [{ message_id, expire_timestamp }]
  ...

luigi:
  subscribed-channels
    channelsIds: [channel_id_1, channel_id_2, ...]
*/
