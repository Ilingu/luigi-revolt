"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecGraphQL = void 0;
const tslib_1 = require("tslib");
const nhost_js_1 = require("@nhost/nhost-js");
const nhost = new nhost_js_1.NhostClient({
    subdomain: process.env.DB_URL,
    region: "eu-central-1",
    adminSecret: process.env.DB_ADMIN,
});
const ExecGraphQL = (gql) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield nhost.graphql.request(gql);
        if (error || !data)
            return { success: false, error: JSON.stringify(error) };
        return { success: true, data };
    }
    catch (err) {
        console.error(err);
        return { success: false, error: `${err}` };
    }
});
exports.ExecGraphQL = ExecGraphQL;
//# sourceMappingURL=nhost.js.map