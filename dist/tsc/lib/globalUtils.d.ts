import { ColorLog } from "./types/enums";
export declare const Log: (message: string, color?: ColorLog, date?: boolean) => void;
export declare const IsEmptyString: (str: unknown) => boolean;
export declare const Sleep: (duration: number, fn?: () => Promise<void>) => Promise<void>;
export declare const SafeJSONParse: <T = unknown>(jsonBytes: string) => T | null;
export declare const Hash: (str: string) => string | null;
