"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQL_DELETE_CHANNEL = exports.GQL_INSERT_CHANNEL = exports.GQL_QUERY_CHANNEL = void 0;
const globalFuncs_1 = require("./globalFuncs");
const GQL_QUERY_CHANNEL = (id) => [
    `query QueryChannel { 
    channels_by_pk(channel_id: "${id}") { 
      channel_id 
    } 
  }`,
    "channels_by_pk",
];
exports.GQL_QUERY_CHANNEL = GQL_QUERY_CHANNEL;
const GQL_INSERT_CHANNEL = (id, options) => ({
    exec: () => (0, globalFuncs_1.CreateChannel)(id, options),
    cmd: [
        `mutation { 
      insert_channels_one(object: { channel_id: "${id}", daily_luigi: ${!!(options === null || options === void 0 ? void 0 : options.isSub)}, image_expire_time: ${(options === null || options === void 0 ? void 0 : options.expireTime) || 432000000} }) { 
        channel_id 
      } 
    }`,
        "insert_channels_one",
    ],
});
exports.GQL_INSERT_CHANNEL = GQL_INSERT_CHANNEL;
const GQL_DELETE_CHANNEL = (id) => ({
    exec: () => (0, globalFuncs_1.DeleteChannel)(id),
    cmd: [
        `mutation { 
      delete_channels_by_pk(channel_id: "${id}") { 
        channel_id 
      } 
    }`,
        "delete_channels_by_pk",
    ],
});
exports.GQL_DELETE_CHANNEL = GQL_DELETE_CHANNEL;
//# sourceMappingURL=globalSchema.js.map