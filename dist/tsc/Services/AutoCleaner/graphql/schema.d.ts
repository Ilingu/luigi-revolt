import type { GqlQuery, GraphQLCommand, ImageToDeleteShape } from "../../../lib/types/types";
export declare const GQL_UPDATE_IMG_EXPIRE_TIME: (id: string, newTime: number | string) => GqlQuery;
export declare const GQL_QUERY_IMG_EXPIRE_TIME: (id: string) => GraphQLCommand<number>;
export declare const GQL_QUERY_ALL_IMAGES: GqlQuery;
export declare const GQL_QUERY_ALL_CHANNEL_IMAGES: (id: string) => GraphQLCommand<ImageToDeleteShape[]>;
export declare const GQL_INSERT_CHANNEL_IMG: (chId: string, msgId: string, expireDate: number) => GqlQuery;
export declare const GQL_DELETE_ALL_CHANNEL_IMAGES: (chId: string) => string[];
export declare const GQL_DELETE_IMAGES_BY_MESSAGES_IDS: (messagesIds: string[]) => string[];
