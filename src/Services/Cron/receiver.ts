import Fastify from "fastify";
import cors from "@fastify/cors";
import { Log } from "../../lib/globalUtils";
import { ColorLog } from "../../lib/types/enums";
import { DailyLuigi } from "../Luigi/luigi";
const fastify = Fastify();

const URlWhitlist =
  process.env.APP_MODE === "dev"
    ? "http://localhost:3001"
    : "https://cronapi.up.railway.app";

fastify.register(cors, {
  origin: URlWhitlist,
  methods: ["POST"],
  exposedHeaders: ["Continue"],
});

interface RouteWebhook {
  routePath: string;
  callbackFn: () => void;
}

// Routes
const ServicesWebhooks: RouteWebhook[] = [
  { routePath: "/luigi", callbackFn: DailyLuigi },
  { routePath: "/anime-update", callbackFn: () => null },
  { routePath: "/autoclean", callbackFn: () => null },
];

// Register All Routes
for (const { routePath, callbackFn } of ServicesWebhooks) {
  Log(`Turning On ${routePath}`, ColorLog.FgCyan);
  fastify.post(routePath, async (_, rep) => {
    callbackFn();

    Log(`${routePath} Hit! 🎯`, ColorLog.FgMagenta);
    return rep.status(200).header("Continue", "true").send();
  });
}

/**
 * Run the server!
 */
const StartCronReceiverServer = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

export default StartCronReceiverServer;
