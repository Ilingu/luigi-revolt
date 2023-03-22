"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQL_DELETE_IMAGES_BY_MESSAGES_IDS = exports.GQL_DELETE_ALL_CHANNEL_IMAGES = exports.GQL_INSERT_CHANNEL_IMG = exports.GQL_QUERY_ALL_CHANNEL_IMAGES = exports.GQL_QUERY_ALL_IMAGES = exports.GQL_QUERY_IMG_EXPIRE_TIME = exports.GQL_UPDATE_IMG_EXPIRE_TIME = void 0;
const funcs_1 = require("./funcs");
const GQL_UPDATE_IMG_EXPIRE_TIME = (id, newTime) => [
    `mutation {
    update_channels_by_pk(pk_columns: { channel_id: "${id}" }, _set:{ image_expire_time: ${newTime} }) {
      image_expire_time
    }
  }`,
    "update_channels_by_pk",
];
exports.GQL_UPDATE_IMG_EXPIRE_TIME = GQL_UPDATE_IMG_EXPIRE_TIME;
const GQL_QUERY_IMG_EXPIRE_TIME = (id) => ({
    exec: () => (0, funcs_1.QueryChannelImgExpireTime)(id),
    cmd: [
        `query {
      channels_by_pk(channel_id: "${id}") {
        image_expire_time
      }
    }`,
        "channels_by_pk",
    ],
});
exports.GQL_QUERY_IMG_EXPIRE_TIME = GQL_QUERY_IMG_EXPIRE_TIME;
exports.GQL_QUERY_ALL_IMAGES = [
    `query QueryAllImagesToDelete {
    ImgToDelete {
      channel
      message_id
      expire_timestamp
    }
  }`,
    "ImgToDelete",
];
const GQL_QUERY_ALL_CHANNEL_IMAGES = (id) => ({
    exec: () => (0, funcs_1.QueryAllChannelImages)(id),
    cmd: [
        `query QueryAllChannelImages { 
      channels_by_pk(channel_id: "${id}") {
        ImagesToDelete  {
          channel
          message_id
          expire_timestamp
        }
      }
    }`,
        "channels_by_pk",
    ],
});
exports.GQL_QUERY_ALL_CHANNEL_IMAGES = GQL_QUERY_ALL_CHANNEL_IMAGES;
const GQL_INSERT_CHANNEL_IMG = (chId, msgId, expireDate) => [
    `mutation {
    insert_ImgToDelete_one(object: {channel: "${chId}", message_id: "${msgId}", expire_timestamp: ${expireDate}}) {
      expire_timestamp
    }
  }`,
    "insert_ImgToDelete_one",
];
exports.GQL_INSERT_CHANNEL_IMG = GQL_INSERT_CHANNEL_IMG;
const GQL_DELETE_ALL_CHANNEL_IMAGES = (chId) => [
    `mutation {
    delete_ImgToDelete(where: {parent_channel: {channel_id: {_eq: "${chId}"}}}) {
      returning {
        message_id
      }
    }
  }`,
    "delete_ImgToDelete",
];
exports.GQL_DELETE_ALL_CHANNEL_IMAGES = GQL_DELETE_ALL_CHANNEL_IMAGES;
const GQL_DELETE_IMAGES_BY_MESSAGES_IDS = (messagesIds) => [
    `mutation {
    delete_ImgToDelete(where: { message_id: { _in: ${JSON.stringify(messagesIds)} } }) {
      returning {
        message_id
      }
    }
  }`,
    "delete_ImgToDelete",
];
exports.GQL_DELETE_IMAGES_BY_MESSAGES_IDS = GQL_DELETE_IMAGES_BY_MESSAGES_IDS;
//# sourceMappingURL=schema.js.map