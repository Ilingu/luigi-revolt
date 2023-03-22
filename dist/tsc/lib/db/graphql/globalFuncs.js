"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteChannel = exports.CreateChannel = exports.IsChannelExist = void 0;
const tslib_1 = require("tslib");
const nhost_1 = require("../nhost");
const globalSchema_1 = require("./globalSchema");
const utils_1 = require("../utils");
const IsChannelExist = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const [QUERY_CHANNEL, GqlFunc] = (0, globalSchema_1.GQL_QUERY_CHANNEL)(channelId);
    try {
        const resp = yield (0, nhost_1.ExecGraphQL)(QUERY_CHANNEL);
        return (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
    }
    catch (err) {
        console.error(err);
        return false;
    }
});
exports.IsChannelExist = IsChannelExist;
const CreateChannel = (channelId, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const [INSERT_CHANNEL, GqlFunc] = (0, globalSchema_1.GQL_INSERT_CHANNEL)(channelId, options).cmd;
    try {
        const resp = yield (0, nhost_1.ExecGraphQL)(INSERT_CHANNEL);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return { success, data: (resp === null || resp === void 0 ? void 0 : resp.data) && resp.data[GqlFunc] };
    }
    catch (err) {
        console.error(err);
        return { success: false, error: typeof err === "string" ? err : undefined };
    }
});
exports.CreateChannel = CreateChannel;
const DeleteChannel = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const [DELETE_CHANNEL, GqlFunc] = (0, globalSchema_1.GQL_DELETE_CHANNEL)(channelId).cmd;
    try {
        const resp = yield (0, nhost_1.ExecGraphQL)(DELETE_CHANNEL);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return { success, data: (resp === null || resp === void 0 ? void 0 : resp.data) && resp.data[GqlFunc] };
    }
    catch (err) {
        console.error(err);
        return { success: false, error: typeof err === "string" ? err : undefined };
    }
});
exports.DeleteChannel = DeleteChannel;
//# sourceMappingURL=globalFuncs.js.map