import Fastify from "fastify";
import { Log } from "../../lib/globalUtils";
import { ConsoleLog } from "../../lib/types/enums";
import { DailyLuigi } from "../Luigi/luigi";
const fastify = Fastify({
  logger: true,
});

interface RouteWebhook {
  routePath: string;
  callbackFn: () => void;
}

// Routes
const ServicesWebhooks: RouteWebhook[] = [
  { routePath: "/luigi", callbackFn: DailyLuigi },
  { routePath: "/anime-update", callbackFn: () => null },
];

// Register All Routes
for (const { routePath, callbackFn } of ServicesWebhooks) {
  Log(`Turning On ${routePath}`, ConsoleLog.FgCyan);
  fastify.post(routePath, async (req, rep) => {
    callbackFn();

    if (req.hostname !== "cronapi.up.railway.app")
      return rep.status(401).send(); // ❌
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
