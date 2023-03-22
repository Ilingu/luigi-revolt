"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsExistingCmd = exports.ParseMsgCmd = exports.HandleCmdsExec = exports.Reply = exports.ReplyTimeout = void 0;
const tslib_1 = require("tslib");
const enums_1 = require("../lib/types/enums");
const globalUtils_1 = require("../lib/globalUtils");
const ReplyTimeout = (message, err) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const m = yield message.reply({ content: err });
        if (!m)
            return;
        yield (0, globalUtils_1.Sleep)(5000, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield m.delete(); }));
    }
    catch (err) {
        (0, globalUtils_1.Log)(err, enums_1.ColorLog.FgRed);
    }
});
exports.ReplyTimeout = ReplyTimeout;
const Reply = (message, msg) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield message.reply({ content: msg });
    }
    catch (err) {
        (0, globalUtils_1.Log)(err, enums_1.ColorLog.FgRed);
        return null;
    }
});
exports.Reply = Reply;
const HandleCmdsExec = ({ CmdToExec, replyPipe, errorMsg, loadingMsg, successMsg, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const RepondMsg = (msgType) => !(0, globalUtils_1.IsEmptyString)(msgType) && (0, exports.Reply)(replyPipe, msgType);
    let m;
    try {
        m = yield RepondMsg(loadingMsg);
        const cmdResp = yield CmdToExec;
        m && m.delete();
        cmdResp.success && RepondMsg(successMsg);
        !cmdResp.success && RepondMsg(errorMsg);
        return cmdResp;
    }
    catch (err) {
        m && m.delete();
        RepondMsg(errorMsg);
        return { success: false };
    }
});
exports.HandleCmdsExec = HandleCmdsExec;
const cmdRegex = /(luigi|ac|anime)!([a-zA-Z]+)(?: ([a-zA-Z0-9 ]+))?/im;
const ParseMsgCmd = (content, PREFIX) => {
    const includeCmd = !(0, globalUtils_1.IsEmptyString)(content) && (content === null || content === void 0 ? void 0 : content.startsWith(PREFIX));
    if (!includeCmd)
        return { success: false };
    if (!isValidCmd(content))
        return { success: false, error: "❌ Invalid Command" };
    const cmd = extractCmd(content);
    if (!cmd)
        return { success: false, error: "❌ Command Not Found" };
    return { success: true, data: cmd };
};
exports.ParseMsgCmd = ParseMsgCmd;
const isValidCmd = (str) => {
    if ((0, globalUtils_1.IsEmptyString)(str))
        return false;
    return cmdRegex.test(str);
};
const extractCmd = (cmd) => {
    if (!isValidCmd(cmd))
        return null;
    const extractedRawCmd = cmd.match(cmdRegex);
    if ((extractedRawCmd === null || extractedRawCmd === void 0 ? void 0 : extractedRawCmd.length) !== 4)
        return null;
    const [bot, instruction, arg] = extractedRawCmd.slice(1);
    const args = arg && arg.split(" ");
    if (!(0, exports.IsExistingCmd)(bot, instruction))
        return null;
    return [instruction, args || []];
};
const IsExistingCmd = (bot, cmd) => {
    if (bot === "luigi" && (cmd === "enable" || cmd === "disable"))
        return true;
    if (bot === "ac" && (cmd === "time" || cmd === "index"))
        return true;
    return false;
};
exports.IsExistingCmd = IsExistingCmd;
//# sourceMappingURL=utils.js.map