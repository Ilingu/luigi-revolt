"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acDeleteImages = void 0;
const tslib_1 = require("tslib");
const revolt_js_1 = require("revolt.js");
const enums_1 = require("../../lib/types/enums");
const globalUtils_1 = require("../../lib/globalUtils");
const utils_1 = require("../utils");
const globalFuncs_1 = require("../../lib/db/graphql/globalFuncs");
const funcs_1 = require("./graphql/funcs");
const schema_1 = require("./graphql/schema");
const nhost_1 = require("../../lib/db/nhost");
const cmds_1 = require("./cmds");
const ac = new revolt_js_1.Client();
const PREFIX = "ac!";
let isUp = false;
ac.on("ready", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    isUp = true;
    (0, globalUtils_1.Log)(`Logged in as ${(_a = ac === null || ac === void 0 ? void 0 : ac.user) === null || _a === void 0 ? void 0 : _a.username}!`, enums_1.ColorLog.FgBlue, true);
    ac.channels.forEach(({ _id: chId }) => {
        (0, globalFuncs_1.CreateChannel)(chId);
    });
}));
ac.on("channel/create", (ch) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { success } = yield (0, globalFuncs_1.CreateChannel)(ch._id);
    const m = yield ch.sendMessage({
        content: success
            ? "Channel Successfully Indexed ✅"
            : "Couldn't index this channel ❌",
    });
    setTimeout(() => m.delete(), 10000);
}));
ac.on("channel/delete", (chId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const success = yield (0, funcs_1.DeleteAllChannelImages)(chId);
    success && (yield (0, globalFuncs_1.DeleteChannel)(chId));
}));
ac.on("message", (message) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const MessageID = message._id;
    const ChannelID = message.channel_id;
    if (message.attachments && message.attachments.length > 0) {
        const { success } = yield (0, funcs_1.InsertChannelImg)(ChannelID, MessageID, (message === null || message === void 0 ? void 0 : message.createdAt) || Date.now());
        if (!success) {
            yield message.delete();
            yield ((_b = message.channel) === null || _b === void 0 ? void 0 : _b.sendMessage("### This image was deleted by @AutoCleaner, because I couldn't add it to the deletion queue. Try again."));
            return;
        }
    }
    const { success: isCmd, data: cmd, error, } = (0, utils_1.ParseMsgCmd)(message.content, PREFIX);
    if (isCmd && cmd) {
        const [instruction, args] = cmd;
        if (instruction === "time") {
            if (args.length !== 1 || isNaN(parseInt(args[0])))
                return (0, utils_1.ReplyTimeout)(message, 'Invalid args ❌. E.g: "ac!<command> <arg1> <arg2>"');
            const UpdateETPromise = (0, cmds_1.UpdateExpireTime)(ChannelID, args[0]);
            (0, utils_1.HandleCmdsExec)({
                CmdToExec: UpdateETPromise,
                replyPipe: message,
                loadingMsg: "Updating this channel expire time ⏳",
                successMsg: "Channel expire time updated Successfully ✅",
                errorMsg: "Couldn't Update this channel expire time ❌",
            });
        }
        else if (instruction === "index") {
            const CreateChPromise = (0, globalFuncs_1.CreateChannel)(ChannelID);
            (0, utils_1.HandleCmdsExec)({
                CmdToExec: CreateChPromise,
                replyPipe: message,
                loadingMsg: "Indexing this Channel ⏳",
                successMsg: "Channel Successfully Indexed ✅",
                errorMsg: "Couldn't index this channel ❌ (hint: this channel is possibly already indexed in the DB) ",
            });
        }
        else
            (0, utils_1.ReplyTimeout)(message, "❌ Invalid Command instruction");
    }
    error && (0, utils_1.Reply)(message, error);
}));
ac.on("message/delete", (msgId, msg) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (msg && msg.attachments && msg.attachments.length > 0) {
        const [DELETE_IMAGES] = (0, schema_1.GQL_DELETE_IMAGES_BY_MESSAGES_IDS)([msgId]);
        yield (0, nhost_1.ExecGraphQL)(DELETE_IMAGES);
    }
}));
const acDeleteImages = (chId, msgIds) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const ch = yield ac.channels.fetch(chId);
        yield ch.deleteMessages(msgIds);
        return { success: true };
    }
    catch (err) {
        console.log(err);
        (0, globalUtils_1.Log)(`Failed to delete messages on Channel ${chId} ❌`, enums_1.ColorLog.FgRed);
        return { success: false };
    }
});
exports.acDeleteImages = acDeleteImages;
const StartACBot = () => {
    if (process.env.AUTOCLEANER_BOT_TOKEN)
        ac.loginBot(process.env.AUTOCLEANER_BOT_TOKEN).then(() => (0, globalUtils_1.Log)("🔒 AC Crediential OK", enums_1.ColorLog.FgGreen));
    else
        (0, globalUtils_1.Log)("Cannot Login Into AC Bot", enums_1.ColorLog.FgRed);
};
ac.on("dropped", () => {
    isUp = false;
    setTimeout(() => {
        if (!isUp)
            StartACBot();
    }, 10000);
});
exports.default = StartACBot;
//# sourceMappingURL=bot.js.map