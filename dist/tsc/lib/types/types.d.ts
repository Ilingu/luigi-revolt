import type { Message } from "revolt.js";
export declare type AvailableCmds = "enable" | "disable" | "time" | "index";
export declare type AvailableBots = "luigi" | "ac" | "anime";
export declare type CmdShape = [AvailableBots, AvailableCmds, string];
export declare type ParsedCmdShape = [AvailableCmds, string[]];
export declare type GqlQuery = [string, string];
export interface GraphQLCommand<T> {
    exec: () => Promise<FunctionJob<T>>;
    cmd: GqlQuery;
}
export interface FunctionJob<T = never> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface CmdsExecArgsShape<T = never> {
    replyPipe: Message;
    CmdToExec: Promise<FunctionJob<T>>;
    loadingMsg?: string;
    successMsg?: string;
    errorMsg?: string;
}
export declare type nHostResp<T = nHostRespType> = {
    [K: string]: T;
};
export declare type nHostRespType = any;
export interface ChannelShape {
    channel_id: string;
    daily_luigi: boolean;
    created_at: Date;
}
export interface ImageToDeleteShape {
    channel: string;
    message_id: string;
    expire_timestamp: number;
    parent_channel: ChannelShape;
}
export interface CreateChannelOption {
    isSub?: boolean;
    expireTime?: number | string;
}
export interface AnimeEpisodeShape {
    Title: string;
    EpisodeId: string;
    TimeReleased: string;
    Img: string;
    Team: string;
}
