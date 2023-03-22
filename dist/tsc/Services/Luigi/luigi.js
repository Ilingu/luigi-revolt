"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyLuigi = void 0;
const tslib_1 = require("tslib");
const bot_1 = require("./bot");
const funcs_1 = require("./graphql/funcs");
const DailyLuigi = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const LuigiOfTheDay = generateLuigiOfDay();
    const { success, data: subsChannels } = yield (0, funcs_1.queryAllSubsChannels)();
    if (!success || !subsChannels || subsChannels.length <= 0)
        return;
    subsChannels.forEach((ch) => (0, bot_1.SendLuigiDailyMsg)(ch, LuigiOfTheDay));
});
exports.DailyLuigi = DailyLuigi;
const dateZero = new Date("08/25/2022").getTime();
const ONE_DAY_IN_MS = 86400000;
const generateLuigiOfDay = () => {
    const deltaTime = Date.now() - dateZero;
    const daysElapsed = Math.round(deltaTime / ONE_DAY_IN_MS);
    return daysElapsed;
};
//# sourceMappingURL=luigi.js.map