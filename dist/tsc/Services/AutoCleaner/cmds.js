"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpireTime = void 0;
const tslib_1 = require("tslib");
const nhost_1 = require("../../lib/db/nhost");
const globalFuncs_1 = require("../../lib/db/graphql/globalFuncs");
const utils_1 = require("../../lib/db/utils");
const schema_1 = require("./graphql/schema");
const UpdateExpireTime = (chId, newTime) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!(yield (0, globalFuncs_1.IsChannelExist)(chId))) {
            const { success } = yield (0, globalFuncs_1.CreateChannel)(chId, { expireTime: newTime });
            return {
                success,
                error: !success ? "cannot create root channel" : undefined,
            };
        }
        const [UPDATE_IMG_EXPIRE_TIME, GqlFunc] = (0, schema_1.GQL_UPDATE_IMG_EXPIRE_TIME)(chId, newTime);
        const resp = yield (0, nhost_1.ExecGraphQL)(UPDATE_IMG_EXPIRE_TIME);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        if ((resp === null || resp === void 0 ? void 0 : resp.data) &&
            ((_a = resp.data[GqlFunc]) === null || _a === void 0 ? void 0 : _a.image_expire_time) !== parseInt(newTime.toString()))
            return { success: false };
        return { success };
    }
    catch (err) {
        return { success: false };
    }
});
exports.UpdateExpireTime = UpdateExpireTime;
//# sourceMappingURL=cmds.js.map