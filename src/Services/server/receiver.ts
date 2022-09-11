import Fastify from "fastify";
import cors from "@fastify/cors";
import { Hash, IsEmptyString, Log, SafeJSONParse } from "../../lib/globalUtils";
import { ColorLog } from "../../lib/types/enums";
import { DailyLuigi } from "../Luigi/luigi";
import { CheckAndDeleteExpiredImage } from "../AutoCleaner/autoCleaner";
import { TriggerAnimeUpdate } from "../AnimeUpdates/BotUpdates";
import { AnimeEpisodeShape } from "../../lib/types/types";
import middie from "@fastify/middie";
const fastify = Fastify();

interface RouteWebhook {
  routePath: string;
  callbackFn: () => void;
}

const CORSConfig = {
  origin: [
    "https://cronapi.up.railway.app",
    "https://adkami-scapping-api.up.railway.app",
  ],
  methods: ["POST"],
  exposedHeaders: ["Continue"],
};

// Routes
const ServicesWebhooks: RouteWebhook[] = [
  { routePath: "/luigi", callbackFn: DailyLuigi },
  { routePath: "/clean", callbackFn: CheckAndDeleteExpiredImage },
];

// Register All Routes to their Cron
{
  for (const { routePath, callbackFn } of ServicesWebhooks) {
    Log(`Turning On ${routePath}`, ColorLog.FgCyan);
    fastify.post(routePath, async (_, rep) => {
      callbackFn();

      Log(`${routePath} Hit! 🎯`, ColorLog.FgMagenta, true);
      return rep.status(200).header("Continue", "true").send();
    });
  }
}

// Register special routes
{
  Log(`Turning On /animeUpdates`, ColorLog.FgCyan);
  fastify.post("/animeUpdates", async (req, rep) => {
    Log(`/animeUpdates Hit! 🎯`, ColorLog.FgMagenta, true);
    let body = req.body;

    if (typeof body === "string") body = SafeJSONParse(body);
    if (typeof body === "object")
      TriggerAnimeUpdate(body as AnimeEpisodeShape[]);

    return rep.status(200).header("Continue", "true").send();
  });
}

// Middlewares
const AuthMiddleware: Parameters<typeof fastify.use>[1] = (req, res, next) => {
  const ThrowErr = () => {
    res.writeHead(401);
    res.write("Cannot Trust Source");
    res.end();
  };

  const serverTrustToken = req.headers?.authorization;
  if (IsEmptyString(serverTrustToken)) return ThrowErr(); // X
  if (Hash(serverTrustToken) !== process.env.SERVER_TRUST_KEY)
    return ThrowErr(); // X

  return next();
};

/**
 * Run the server!
 */
const StartCronReceiverServer = async () => {
  try {
    // CORS
    await fastify.register(cors, CORSConfig);
    // Auth Middleware
    await fastify.register(middie, { hook: "onRequest" });
    await fastify.use(AuthMiddleware);

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
