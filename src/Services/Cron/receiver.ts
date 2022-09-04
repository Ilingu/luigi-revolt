import Fastify from "fastify";
import cors from "@fastify/cors";
import { Log } from "../../lib/globalUtils";
import { ColorLog } from "../../lib/types/enums";
import { DailyLuigi } from "../Luigi/luigi";
import { CheckAndDeleteExpiredImage } from "../AutoCleaner/autoCleaner";
import { TriggerAnimeUpdate } from "../AnimeUpdates/BotUpdates";
import { AnimeEpisodeShape } from "../../lib/types/types";
const fastify = Fastify();

interface RouteWebhook {
  routePath: string;
  callbackFn: () => void;
}

// Routes
const ServicesWebhooks: RouteWebhook[] = [
  { routePath: "/luigi", callbackFn: DailyLuigi },
  { routePath: "/clean", callbackFn: CheckAndDeleteExpiredImage },
];

// Register All Routes
for (const { routePath, callbackFn } of ServicesWebhooks) {
  Log(`Turning On ${routePath}`, ColorLog.FgCyan);
  fastify.post(routePath, async (_, rep) => {
    callbackFn();

    Log(`${routePath} Hit! 🎯`, ColorLog.FgMagenta, true);
    return rep.status(200).header("Continue", "true").send();
  });
}

// Register special routes
Log(`Turning On /animeUpdates`, ColorLog.FgCyan);
fastify.post("/animeUpdates", async (req, rep) => {
  if (typeof req.body === "object")
    TriggerAnimeUpdate(req.body as AnimeEpisodeShape[]);

  Log(`/animeUpdates Hit! 🎯`, ColorLog.FgMagenta, true);
  return rep.status(200).header("Continue", "true").send();
});

/**
 * Run the server!
 */
const StartCronReceiverServer = async () => {
  try {
    // CORS
    await fastify.register(cors, {
      origin: [
        "https://cronapi.up.railway.app",
        "https://adkami-scapping-api.up.railway.app",
      ],
      methods: ["POST"],
      exposedHeaders: ["Continue"],
    });

    // Server
    await fastify.listen({
      port: parseInt(process.env.PORT || "3000"),
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

export default StartCronReceiverServer;
