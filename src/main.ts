import "dotenv/config";
import StartACBot from "./Services/AutoCleaner/bot";
import StartLuigiBot from "./Services/Luigi/bot";

StartLuigiBot();
StartACBot();
