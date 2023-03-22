"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsGqlReqSucceed = void 0;
const IsGqlReqSucceed = ({ success, data }, GqlFunc) => success && typeof data === "object" && !!data[GqlFunc];
exports.IsGqlReqSucceed = IsGqlReqSucceed;
//# sourceMappingURL=utils.js.map