import { NhostClient } from "@nhost/nhost-js";
import type { FunctionJob, nHostResp, nHostRespType } from "../types/types";

const nhost = new NhostClient({
  // backendUrl: `https://${process.env.DB_URL}.nhost.run`,
  subdomain: process.env.DB_URL,
  region: "eu-central-1",
  adminSecret: process.env.DB_ADMIN,
});

export const ExecGraphQL = async <T = nHostRespType>(
  gql: string
): Promise<FunctionJob<nHostResp<T>>> => {
  try {
    const { data, error } = await nhost.graphql.request<nHostResp<T>>(gql);
    if (error || !data) return { success: false, error: JSON.stringify(error) };

    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: `${err}` };
  }
};
