import { Log } from "../../lib/globalUtils";
import { ColorLog } from "../../lib/types/enums";
import fetch from "node-fetch";

interface CronAPIBody {
  body?: {
    Frequency: string;
    CallbackUrl: string;
  };
  CronServiceUrl?: string;
}

const CronToRegister: CronAPIBody[] = [
  {
    body: {
      Frequency: "@daily",
      CallbackUrl: `https://luigi-revolt.onrender.com/luigi`,
    },
  },
  // {
  //   body: {
  //     Frequency: "@daily",
  //     CallbackUrl: `https://revolt-bots.up.railway.app/clean`,
  //   },
  // },
  // {
  //   CronServiceUrl: `https://adkami-scapping-api.up.railway.app/subscribeToUpdates?callbackurl=${encodeURIComponent(
  //     "https://revolt-bots.up.railway.app/animeUpdates"
  //   )}`,
  // },
];

/**
 * Add/register CronJob for all bot
 */
export const RegisterAllService = async () => {
  for (const { body, CronServiceUrl } of CronToRegister) {
    const RegisterURL = CronServiceUrl || "https://cronapi.onrender.com/addJob";
    const IsCronAPI = !CronServiceUrl;

    try {
      const res = await fetch(RegisterURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: IsCronAPI ? process.env.CRON_API_KEY || "" : "",
        },
        body: JSON.stringify(body),
      });

      Log(
        `${body?.CallbackUrl || RegisterURL}: ${
          res.ok ? "OK ✅" : "ERROR ❌"
        } `,
        res.ok ? ColorLog.FgGreen : ColorLog.FgRed
      );
    } catch (err) {
      Log(`${body?.CallbackUrl || RegisterURL}: "ERROR ❌`, ColorLog.FgRed);
    }
  }
};
