import type { Message } from "revolt.js";

export type AvailableCmds = "enable" | "disable" | "time" | "index";
export type AvailableBots = "luigi" | "ac" | "anime";
export type CmdShape = [AvailableBots, AvailableCmds, string];
export type ParsedCmdShape = [AvailableCmds, string[]];

export type GqlQuery = [string, string];
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

export type nHostResp<T = nHostRespType> = {
  [K: string]: T;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type nHostRespType = any;

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
