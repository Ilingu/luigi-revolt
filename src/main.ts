import "dotenv/config";
import StartACBot from "./Services/AutoCleaner/bot";
import StartCronReceiverServer from "./Services/Cron/receiver";
import StartLuigiBot from "./Services/Luigi/bot";

const mainProcess = async () => {
  // Server
  StartCronReceiverServer();

  // Bots
  StartLuigiBot();
  StartACBot();
};
mainProcess();
