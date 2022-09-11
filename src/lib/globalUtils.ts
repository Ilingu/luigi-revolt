import crypto from "crypto";
import { ColorLog } from "./types/enums";

/**
 * `console.log` but customisable (Color, date...). **do not use for debugging**
 * @param {string} message
 * @param color
 * @param date
 */
export const Log = (message: string, color = ColorLog.FgBlue, date = false) =>
  console.log(
    color,
    `${date ? new Date().toLocaleString() + ": " : ""}${message}`
  );

/**
 * Check if the arg is a valid non empty string
 * @param {unknown} str
 * @return {boolean}
 */
export const IsEmptyString = (str: unknown): boolean =>
  typeof str !== "string" || str.trim().length <= 0;

/**
 * Sleep the code for `x` secondes
 * @param {number} duration
 * @param {() => Promise<void>} fn?
 */
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

/**
 * `JSON.parse` but with a try/catch block
 * @param {string} jsonBytes
 * @return {T | null} json obj
 */
export const SafeJSONParse = <T = unknown>(jsonBytes: string): T | null => {
  try {
    return JSON.parse(jsonBytes);
  } catch (err) {
    return null;
  }
};

/**
 * returns the SHA256 cryptographic Hash of a string
 * @param {string} str
 * @return {string | null} Hash
 */
export const Hash = (str: string): string | null => {
  if (IsEmptyString(str)) return null;
  return crypto.createHash("sha256").update(str).digest("hex");
};
