import type { Message } from "revolt.js";
import type { AvailableBots, AvailableCmds, CmdsExecArgsShape, FunctionJob, ParsedCmdShape } from "../lib/types/types";
export declare const ReplyTimeout: (message: Message, err: string) => Promise<void>;
export declare const Reply: (message: Message, msg: string) => Promise<Message | null | undefined>;
export declare const HandleCmdsExec: <T = never>({ CmdToExec, replyPipe, errorMsg, loadingMsg, successMsg, }: CmdsExecArgsShape<T>) => Promise<FunctionJob<T>>;
export declare const ParseMsgCmd: (content: string, PREFIX: string) => FunctionJob<ParsedCmdShape>;
export declare const IsExistingCmd: (bot: AvailableBots, cmd: AvailableCmds) => boolean;
