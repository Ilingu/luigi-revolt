import "dotenv/config";
import StartACBot from "./Services/AutoCleaner/bot";
import StartCronReceiverServer from "./Services/server/receiver";
import { RegisterAllService } from "./Services/server/register";
import StartLuigiBot from "./Services/Luigi/bot";

// Where the app start
const mainProcess = async () => {
  // Bots
  StartLuigiBot();
  StartACBot();

  // Server
  await StartCronReceiverServer();
  process.env.APP_MODE === "prod" && RegisterAllService();
};
mainProcess();
