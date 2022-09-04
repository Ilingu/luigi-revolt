import "dotenv/config";
import StartACBot from "./Services/AutoCleaner/bot";
import StartCronReceiverServer from "./Services/Cron/receiver";
import { RegisterAllService } from "./Services/Cron/register";
import StartLuigiBot from "./Services/Luigi/bot";

const mainProcess = async () => {
  // Bots
  StartLuigiBot();
  StartACBot();

  // Server
  await StartCronReceiverServer();
  process.env.APP_MODE === "prod" && RegisterAllService();
};
mainProcess();
