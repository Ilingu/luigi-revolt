import type { FunctionJob, nHostResp } from "../types/types";
export declare const ExecGraphQL: <T = any>(gql: string) => Promise<FunctionJob<nHostResp<T>>>;
