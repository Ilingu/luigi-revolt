import type { ChannelShape, FunctionJob } from "../../lib/types/types";
export declare const EnableChannelCmd: (channelId: string) => Promise<FunctionJob<ChannelShape>>;
export declare const DisableChannelCmd: (channelId: string) => Promise<FunctionJob<ChannelShape>>;
