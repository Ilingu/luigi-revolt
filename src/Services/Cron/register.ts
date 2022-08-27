import { Log } from "../../lib/globalUtils";
import { ColorLog } from "../../lib/types/enums";
import fetch from "node-fetch";

interface CronAPIBody {
  Frequency: string;
  CallbackUrl: string;
}

const ServiceCron: CronAPIBody[] = [
  { Frequency: "@daily", CallbackUrl: "http://localhost:3000/luigi" },
];

export const RegisterAllService = async () => {
  for (const cronToRegister of ServiceCron) {
    const URL = `${
      process.env.APP_MODE === "dev"
        ? "http://localhost:3001"
        : "https://cronapi.up.railway.app"
    }/addJob`;

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
  }
};
