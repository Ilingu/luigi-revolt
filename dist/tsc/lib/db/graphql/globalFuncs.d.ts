import type { FunctionJob, ChannelShape, CreateChannelOption } from "../../types/types";
export declare const IsChannelExist: (channelId: string) => Promise<boolean>;
export declare const CreateChannel: (channelId: string, options?: CreateChannelOption) => Promise<FunctionJob<ChannelShape>>;
export declare const DeleteChannel: (channelId: string) => Promise<FunctionJob<ChannelShape>>;
