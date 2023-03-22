import type { ChannelShape, CreateChannelOption, GqlQuery, GraphQLCommand } from "../../types/types";
export declare const GQL_QUERY_CHANNEL: (id: string) => GqlQuery;
export declare const GQL_INSERT_CHANNEL: (id: string, options?: CreateChannelOption) => GraphQLCommand<ChannelShape>;
export declare const GQL_DELETE_CHANNEL: (id: string) => GraphQLCommand<ChannelShape>;
