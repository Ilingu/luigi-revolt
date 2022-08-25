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
