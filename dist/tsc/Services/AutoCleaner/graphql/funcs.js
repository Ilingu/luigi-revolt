"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAllChannelImages = exports.InsertChannelImg = exports.QueryAllChannelImages = exports.QueryChannelImgExpireTime = void 0;
const tslib_1 = require("tslib");
const nhost_1 = require("../../../lib/db/nhost");
const utils_1 = require("../../../lib/db/utils");
const schema_1 = require("./schema");
const QueryChannelImgExpireTime = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [QUERY_IMG_EXPIRE_TIME, GqlFunc] = (0, schema_1.GQL_QUERY_IMG_EXPIRE_TIME)(channelId).cmd;
        const resp = yield (0, nhost_1.ExecGraphQL)(QUERY_IMG_EXPIRE_TIME);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return {
            success,
            data: (resp === null || resp === void 0 ? void 0 : resp.data) && (((_a = resp.data[GqlFunc]) === null || _a === void 0 ? void 0 : _a.image_expire_time) || 432000000),
        };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.QueryChannelImgExpireTime = QueryChannelImgExpireTime;
const QueryAllChannelImages = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const [QUERY_CHANNEL_IMGS, GqlFunc] = (0, schema_1.GQL_QUERY_ALL_CHANNEL_IMAGES)(channelId).cmd;
        const resp = yield (0, nhost_1.ExecGraphQL)(QUERY_CHANNEL_IMGS);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        return { success, data: (resp === null || resp === void 0 ? void 0 : resp.data) && ((_b = resp.data[GqlFunc]) === null || _b === void 0 ? void 0 : _b.ImagesToDelete) };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.QueryAllChannelImages = QueryAllChannelImages;
const InsertChannelImg = (channelId, msgId, msgCreatedAt) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        let { success, data: imgExpireTime } = yield (0, exports.QueryChannelImgExpireTime)(channelId);
        if (!success || !imgExpireTime)
            imgExpireTime = 432000000;
        const [INSERT_CHANNEL_IMG] = (0, schema_1.GQL_INSERT_CHANNEL_IMG)(channelId, msgId, msgCreatedAt + imgExpireTime);
        const { success: inserted } = yield (0, nhost_1.ExecGraphQL)(INSERT_CHANNEL_IMG);
        return { success: inserted };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.InsertChannelImg = InsertChannelImg;
const DeleteAllChannelImages = (channelId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const [DELETE_ALL_CHANNEL_IMAGES] = (0, schema_1.GQL_DELETE_ALL_CHANNEL_IMAGES)(channelId);
        const { success } = yield (0, nhost_1.ExecGraphQL)(DELETE_ALL_CHANNEL_IMAGES);
        return { success };
    }
    catch (err) {
        console.error(err);
        return { success: false };
    }
});
exports.DeleteAllChannelImages = DeleteAllChannelImages;
//# sourceMappingURL=funcs.js.map