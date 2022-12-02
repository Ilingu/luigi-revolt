import "dotenv/config";
import StartCronReceiverServer from "./Services/server/receiver";
import { RegisterAllService } from "./Services/server/register";
import StartLuigiBot from "./Services/Luigi/bot";
// import StartACBot from "./Services/AutoCleaner/bot";

// Where the app start
const mainProcess = async () => {
  // Bots
  StartLuigiBot();
  // StartACBot(); --> shutted down because useless

  // Server
  await StartCronReceiverServer();
  process.env.APP_MODE === "prod" && RegisterAllService();
};
mainProcess();
