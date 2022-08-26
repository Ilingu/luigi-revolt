import "dotenv/config";
import StartACBot from "./Services/AutoCleaner/bot";
import StartCronReceiverServer from "./Services/CronReceiver/server";
import StartLuigiBot from "./Services/Luigi/bot";

// Server
StartCronReceiverServer();

// Bots
StartLuigiBot();
StartACBot();
