"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisableChannelCmd = exports.EnableChannelCmd = void 0;
const tslib_1 = require("tslib");
const nhost_1 = require("../../lib/db/nhost");
const globalFuncs_1 = require("../../lib/db/graphql/globalFuncs");
const enums_1 = require("../../lib/types/enums");
const globalUtils_1 = require("../../lib/globalUtils");
const utils_1 = require("../../lib/db/utils");
const schema_1 = require("./graphql/schema");
const EnableChannelCmd = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, globalUtils_1.Log)(`Enabling Channel #${channelId}`, enums_1.ColorLog.FgBlue);
    try {
        if (!(yield (0, globalFuncs_1.IsChannelExist)(channelId))) {
            const { success } = yield (0, globalFuncs_1.CreateChannel)(channelId, { isSub: true });
            return {
                success,
                error: !success ? "cannot create root channel" : undefined,
            };
        }
        const [SUB_LUIGI, GqlFunc] = (0, schema_1.GQL_SUBS_LUIGI_HANDLER)(channelId, true);
        const resp = yield (0, nhost_1.ExecGraphQL)(SUB_LUIGI);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return { success, data: (resp === null || resp === void 0 ? void 0 : resp.data) && resp.data[GqlFunc] };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.EnableChannelCmd = EnableChannelCmd;
const DisableChannelCmd = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, globalUtils_1.Log)(`Disabling Channel #${channelId}`, enums_1.ColorLog.FgBlue);
    try {
        const [UNSUB_LUIGI, GqlFunc] = (0, schema_1.GQL_SUBS_LUIGI_HANDLER)(channelId, false);
        const resp = yield (0, nhost_1.ExecGraphQL)(UNSUB_LUIGI);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return { success, data: (resp === null || resp === void 0 ? void 0 : resp.data) && resp.data[GqlFunc] };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.DisableChannelCmd = DisableChannelCmd;
//# sourceMappingURL=cmds.js.map