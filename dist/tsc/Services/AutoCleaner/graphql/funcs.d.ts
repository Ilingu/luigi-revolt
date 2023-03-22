import type { FunctionJob, ImageToDeleteShape } from "../../../lib/types/types";
export declare const QueryChannelImgExpireTime: (channelId: string) => Promise<FunctionJob<number>>;
export declare const QueryAllChannelImages: (channelId: string) => Promise<FunctionJob<ImageToDeleteShape[]>>;
export declare const InsertChannelImg: (channelId: string, msgId: string, msgCreatedAt: number) => Promise<FunctionJob>;
export declare const DeleteAllChannelImages: (channelId: string) => Promise<FunctionJob>;
