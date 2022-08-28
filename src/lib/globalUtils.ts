import { ColorLog } from "./types/enums";

export const Log = (message: string, color = ColorLog.FgBlue, date = false) =>
  console.log(
    color,
    `${date ? new Date().toLocaleString() + ": " : ""}${message}`
  );

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
