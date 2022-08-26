import { ConsoleLog } from "./types/enums";

export const Log = (message: string, color = ConsoleLog.FgBlue) =>
  console.log(color, message);

export const IsEmptyString = (str: unknown) =>
  typeof str !== "string" || str.trim().length <= 0;

export const Sleep = (
  duration: number,
  fn?: () => Promise<void>
): Promise<void> =>
  new Promise((res) =>
    setTimeout(async () => {
      if (fn) await fn();
      res();
    }, duration)
  );
