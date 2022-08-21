export type AvailableCmds = "enable" | "disable";

export interface FunctionJob<T = never> {
  success: boolean;
  data?: T;
}
