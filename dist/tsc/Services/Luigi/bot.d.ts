import type { ChannelShape } from "../../lib/types/types";
export declare const SendLuigiDailyMsg: ({ channel_id, daily_luigi }: ChannelShape, LuigiOfDay: number) => Promise<void>;
declare const StartLuigiBot: () => void;
export default StartLuigiBot;
