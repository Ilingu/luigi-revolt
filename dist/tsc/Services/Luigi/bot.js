"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendLuigiDailyMsg = void 0;
const tslib_1 = require("tslib");
const revolt_js_1 = require("revolt.js");
const enums_1 = require("../../lib/types/enums");
const globalUtils_1 = require("../../lib/globalUtils");
const cmds_1 = require("./cmds");
const utils_1 = require("../utils");
const luigi = new revolt_js_1.Client();
const PREFIX = "luigi!";
let isUp = false;
luigi.on("ready", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    isUp = true;
    (0, globalUtils_1.Log)(`Logged in as ${(_a = luigi === null || luigi === void 0 ? void 0 : luigi.user) === null || _a === void 0 ? void 0 : _a.username}!`, enums_1.ColorLog.FgBlue, true);
}));
luigi.on("message", (message) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const ChannelID = message.channel_id;
    const { success: isCmd, data: cmd, error, } = (0, utils_1.ParseMsgCmd)(message.content, PREFIX);
    if (isCmd && cmd) {
        const [instruction] = cmd;
        if (instruction === "enable") {
            const EnablePromise = (0, cmds_1.EnableChannelCmd)(ChannelID);
            (0, utils_1.HandleCmdsExec)({
                CmdToExec: EnablePromise,
                replyPipe: message,
                loadingMsg: "Enabling this Channel ⏳",
                successMsg: "This Channel is Enabled ✅",
                errorMsg: "Failed to Enable this Channel ❌",
            });
        }
        else if (instruction === "disable") {
            const DisablePromise = (0, cmds_1.DisableChannelCmd)(ChannelID);
            (0, utils_1.HandleCmdsExec)({
                CmdToExec: DisablePromise,
                replyPipe: message,
                loadingMsg: "Disabling this Channel ⏳",
                successMsg: "This Channel is Disabled ✅",
                errorMsg: "Failed to Disable this Channel ❌",
            });
        }
        else
            (0, utils_1.ReplyTimeout)(message, "❌ Invalid Command instruction");
    }
    error && (0, utils_1.Reply)(message, error);
}));
const luigirEmojiId = ":01GBDS81FEJ7XKFXZNFDY0FJ2C:";
const SendLuigiDailyMsg = ({ channel_id, daily_luigi }, LuigiOfDay) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!daily_luigi)
        return;
    try {
        const ch = yield luigi.channels.fetch(channel_id);
        ch.sendMessage({
            embeds: [
                {
                    icon_url: "https://autumn.revolt.chat/avatars/TREZKXil5xWmZ0XI3XwFg7dTqXObYFODOZOY00-gZ2?max_side=16",
                    title: "💚 Luigi of the Day!",
                    description: `## ${luigirEmojiId} Luigi #$${LuigiOfDay}$`,
                    colour: "#f1c40f",
                },
            ],
        });
    }
    catch (err) {
        (0, globalUtils_1.Log)(`Failed to send DailyLuigi on Channel ${channel_id} ❌`, enums_1.ColorLog.FgRed);
    }
});
exports.SendLuigiDailyMsg = SendLuigiDailyMsg;
const StartLuigiBot = () => {
    if (process.env.LUIGI_BOT_TOKEN)
        luigi
            .loginBot(process.env.LUIGI_BOT_TOKEN)
            .then(() => (0, globalUtils_1.Log)("🔒 Luigi Crediential OK", enums_1.ColorLog.FgGreen));
    else
        (0, globalUtils_1.Log)("Cannot Login Into Luigi Bot", enums_1.ColorLog.FgRed);
};
luigi.on("dropped", () => {
    isUp = false;
    setTimeout(() => {
        if (!isUp)
            StartLuigiBot();
    }, 10000);
});
exports.default = StartLuigiBot;
//# sourceMappingURL=bot.js.map