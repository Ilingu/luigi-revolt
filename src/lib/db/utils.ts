import { FunctionJob } from "../types/types";

export const IsGqlReqSucceed = <T = never>(
  { success, data }: FunctionJob<T>,
  GqlFunc: string
): boolean => success && typeof data === "object" && !!data[GqlFunc];
