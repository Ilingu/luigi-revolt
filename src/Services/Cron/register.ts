import { Log } from "../../lib/globalUtils";
import { ColorLog } from "../../lib/types/enums";
import fetch from "node-fetch";

interface CronAPIBody {
  Frequency: string;
  CallbackUrl: string;
}

const DEVMode = process.env.APP_MODE === "dev";
const ServiceCron: CronAPIBody[] = [
  {
    Frequency: "@daily",
    CallbackUrl: `${
      DEVMode ? "http://localhost:3000" : "https://revolt-bots.up.railway.app"
    }/luigi`,
  },
  {
    Frequency: "@daily",
    CallbackUrl: `${
      DEVMode ? "http://localhost:3000" : "https://revolt-bots.up.railway.app"
    }/clean`,
  },
];

export const RegisterAllService = async () => {
  for (const cronToRegister of ServiceCron) {
    const URL = `${
      DEVMode ? "http://localhost:3001" : "https://cronapi.up.railway.app"
    }/addJob`;

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.CRON_API_KEY || "",
        },
        body: JSON.stringify(cronToRegister),
      });
      Log(
        `${cronToRegister.CallbackUrl}: ${res.ok ? "OK ✅" : "ERROR ❌"} `,
        res.ok ? ColorLog.FgGreen : ColorLog.FgRed
      );
    } catch (err) {
      Log(`${cronToRegister.CallbackUrl}: "ERROR ❌`, ColorLog.FgRed);
    }
  }
};
