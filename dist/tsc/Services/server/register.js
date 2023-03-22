"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterAllService = void 0;
const tslib_1 = require("tslib");
const globalUtils_1 = require("../../lib/globalUtils");
const enums_1 = require("../../lib/types/enums");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const CronToRegister = [
    {
        body: {
            Frequency: "@daily",
            CallbackUrl: `https://revolt-bots.up.railway.app/luigi`,
        },
    },
    {
        body: {
            Frequency: "@daily",
            CallbackUrl: `https://revolt-bots.up.railway.app/clean`,
        },
    },
    {
        CronServiceUrl: `https://adkami-scapping-api.up.railway.app/subscribeToUpdates?callbackurl=${encodeURIComponent("https://revolt-bots.up.railway.app/animeUpdates")}`,
    },
];
const RegisterAllService = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    for (const { body, CronServiceUrl } of CronToRegister) {
        const RegisterURL = CronServiceUrl || "https://cronapi.up.railway.app/addJob";
        const IsCronAPI = !CronServiceUrl;
        try {
            const res = yield (0, node_fetch_1.default)(RegisterURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: IsCronAPI ? process.env.CRON_API_KEY || "" : "",
                },
                body: JSON.stringify(body),
            });
            (0, globalUtils_1.Log)(`${(body === null || body === void 0 ? void 0 : body.CallbackUrl) || RegisterURL}: ${res.ok ? "OK ✅" : "ERROR ❌"} `, res.ok ? enums_1.ColorLog.FgGreen : enums_1.ColorLog.FgRed);
        }
        catch (err) {
            (0, globalUtils_1.Log)(`${(body === null || body === void 0 ? void 0 : body.CallbackUrl) || RegisterURL}: "ERROR ❌`, enums_1.ColorLog.FgRed);
        }
    }
});
exports.RegisterAllService = RegisterAllService;
//# sourceMappingURL=register.js.map