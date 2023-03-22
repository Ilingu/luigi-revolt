"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAllSubsChannels = void 0;
const tslib_1 = require("tslib");
const nhost_1 = require("../../../lib/db/nhost");
const utils_1 = require("../../../lib/db/utils");
const schema_1 = require("./schema");
const queryAllSubsChannels = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const [QUERY_ALL_LUIGI_CHANNELS, GqlFunc] = schema_1.GQL_QUERY_ALL_LUIGI_CHANNELS;
    try {
        const resp = yield (0, nhost_1.ExecGraphQL)(QUERY_ALL_LUIGI_CHANNELS);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return { success, data: (resp === null || resp === void 0 ? void 0 : resp.data) && resp.data[GqlFunc] };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.queryAllSubsChannels = queryAllSubsChannels;
//# sourceMappingURL=funcs.js.map