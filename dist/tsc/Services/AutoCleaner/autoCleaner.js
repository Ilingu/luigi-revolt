"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAndDeleteExpiredImage = void 0;
const tslib_1 = require("tslib");
const nhost_1 = require("../../lib/db/nhost");
const utils_1 = require("../../lib/db/utils");
const bot_1 = require("./bot");
const schema_1 = require("./graphql/schema");
const CheckAndDeleteExpiredImage = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const [QUERY_ALL_IMAGES, GqlFunc] = schema_1.GQL_QUERY_ALL_IMAGES;
        const resp = yield (0, nhost_1.ExecGraphQL)(QUERY_ALL_IMAGES);
        const success = (0, utils_1.IsGqlReqSucceed)(resp, GqlFunc);
        const PotentialImagesToDelete = (resp === null || resp === void 0 ? void 0 : resp.data) && resp.data[GqlFunc];
        if (!success ||
            !PotentialImagesToDelete ||
            (PotentialImagesToDelete || []).length <= 0)
            return;
        const ImagesToDelete = PotentialImagesToDelete.filter(({ expire_timestamp }) => expire_timestamp <= Date.now());
        const MsgIDsToDeleteByChannel = {};
        ImagesToDelete.forEach(({ channel, message_id }) => {
            MsgIDsToDeleteByChannel[channel] = [
                ...(MsgIDsToDeleteByChannel[channel] || []),
                message_id,
            ];
        });
        Object.keys(MsgIDsToDeleteByChannel).forEach((chId) => {
            const channelMessagesToDel = MsgIDsToDeleteByChannel[chId];
            (0, bot_1.acDeleteImages)(chId, channelMessagesToDel);
        });
        const [DELETE_IMAGES] = (0, schema_1.GQL_DELETE_IMAGES_BY_MESSAGES_IDS)(ImagesToDelete.map(({ message_id }) => message_id));
        yield (0, nhost_1.ExecGraphQL)(DELETE_IMAGES);
    }
    catch (err) {
        console.error(err);
    }
});
exports.CheckAndDeleteExpiredImage = CheckAndDeleteExpiredImage;
//# sourceMappingURL=autoCleaner.js.map