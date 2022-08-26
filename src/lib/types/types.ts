import type { Message } from "revolt.js";

export type AvailableCmds = "enable" | "disable" | "time";
export type AvailableBots = "luigi" | "ac" | "anime";
export type CmdShape = [AvailableBots, AvailableCmds, string];
export type ParsedCmdShape = [AvailableCmds, string[]];

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
export type nHostRespType = ChannelShape | LuigiChannelShape;

export interface ChannelShape {
  channel_id: string;
}
export interface LuigiChannelShape {
  channel: string;
  subscribed?: boolean;
}
