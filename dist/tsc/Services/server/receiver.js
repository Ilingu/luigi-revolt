"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fastify_1 = tslib_1.__importDefault(require("fastify"));
const cors_1 = tslib_1.__importDefault(require("@fastify/cors"));
const globalUtils_1 = require("../../lib/globalUtils");
const enums_1 = require("../../lib/types/enums");
const luigi_1 = require("../Luigi/luigi");
const BotUpdates_1 = require("../AnimeUpdates/BotUpdates");
const middie_1 = tslib_1.__importDefault(require("@fastify/middie"));
const fastify = (0, fastify_1.default)();
const CORSConfig = {
    origin: [
        "https://cronapi.onrender.com",
    ],
    methods: ["POST"],
    exposedHeaders: ["Continue"],
};
const ServicesWebhooks = [
    { routePath: "/luigi", callbackFn: luigi_1.DailyLuigi },
];
{
    for (const { routePath, callbackFn } of ServicesWebhooks) {
        (0, globalUtils_1.Log)(`Turning On ${routePath}`, enums_1.ColorLog.FgCyan);
        fastify.post(routePath, (_, rep) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            callbackFn();
            (0, globalUtils_1.Log)(`${routePath} Hit! 🎯`, enums_1.ColorLog.FgMagenta, true);
            return rep.status(200).header("Continue", "true").send();
        }));
    }
}
{
    (0, globalUtils_1.Log)(`Turning On /animeUpdates`, enums_1.ColorLog.FgCyan);
    fastify.post("/animeUpdates", (req, rep) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        (0, globalUtils_1.Log)(`/animeUpdates Hit! 🎯`, enums_1.ColorLog.FgMagenta, true);
        let body = req.body;
        if (typeof body === "string")
            body = (0, globalUtils_1.SafeJSONParse)(body);
        if (typeof body === "object")
            (0, BotUpdates_1.TriggerAnimeUpdate)(body);
        return rep.status(200).header("Continue", "true").send();
    }));
}
const AuthMiddleware = (req, res, next) => {
    var _a;
    const ThrowErr = () => {
        res.writeHead(401);
        res.write("Cannot Trust Source");
        res.end();
    };
    const serverTrustToken = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if ((0, globalUtils_1.IsEmptyString)(serverTrustToken))
        return ThrowErr();
    if ((0, globalUtils_1.Hash)(serverTrustToken) !== process.env.SERVER_TRUST_KEY)
        return ThrowErr();
    return next();
};
const StartCronReceiverServer = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.register(cors_1.default, CORSConfig);
        yield fastify.register(middie_1.default, { hook: "onRequest" });
        yield fastify.use(AuthMiddleware);
        yield fastify.listen({
            port: parseInt(process.env.PORT || "3000"),
            host: "0.0.0.0",
        });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
exports.default = StartCronReceiverServer;
//# sourceMappingURL=receiver.js.map