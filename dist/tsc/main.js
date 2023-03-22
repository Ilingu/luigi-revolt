"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("dotenv/config");
const receiver_1 = tslib_1.__importDefault(require("./Services/server/receiver"));
const register_1 = require("./Services/server/register");
const bot_1 = tslib_1.__importDefault(require("./Services/Luigi/bot"));
const mainProcess = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, bot_1.default)();
    yield (0, receiver_1.default)();
    process.env.APP_MODE === "prod" && (0, register_1.RegisterAllService)();
});
mainProcess();
//# sourceMappingURL=main.js.map