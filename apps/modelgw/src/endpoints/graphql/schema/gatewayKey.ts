import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { GatewayKey } from "@prisma/client";
import gql from 'graphql-tag';
import z from 'zod';
import { GatewayKeyConst } from '../../../lib/db/const';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr, encodeGlobalId } from '../utils';
import { zId } from './base';
import { Gateway } from './generated/types';

export const gatewayKeyTypeDefs = gql`
  extend type Gateway {
    keys(after: String, first: Int, before: String, last: Int): GatewayKeyConnection
  }
  type GatewayKey implements Node {
    id: ID!
    name: String!
    maskedKey: String!
    status: String!
    promptTokens: Int!
    completionTokens: Int!
    promptTokensLimit: Int
    completionTokensLimit: Int
    resetFrequency: String
    lastResetAt: String
    parent: GatewayKey
    createdAt: String!
    updatedAt: String!
  }
  type GatewayKeyConnection {
    edges: [GatewayKeyEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  type GatewayKeyEdge {
    node: GatewayKey
    cursor: String!
  }
`;


export const GatewayKeyValidations = {
  gatewayKeyId: zId(),
  name: z.string().min(1, 'Name is required').max(64, 'Name is too long'),
  promptTokensLimit: z.number().int().positive().nullish(),
  completionTokensLimit: z.number().int().positive().nullish(),
  resetFrequency: z.enum([GatewayKeyConst.ResetFrequency.Daily, GatewayKeyConst.ResetFrequency.Hourly]).nullish(),
  parentGatewayKeyId: zId().nullish(),
};


export const gatewayKeyResolvers = {
  Gateway: {
    keys: async (parent: Gateway, args: any, { prismaClient }: ServerContext, _info: any) => {
      return findManyCursorConnection(
        (findManyArgs) => prismaClient.gatewayKey.findMany({
          ...findManyArgs,
          where: {
            gatewayId: parent.id,
            status: GatewayKeyConst.Status.Active,
          },
          include: {
            parent: true,
          },
          orderBy: { name: 'asc' },
        }),
        () => prismaClient.gatewayKey.count({
          where: {
            status: GatewayKeyConst.Status.Active,
          }
        }),
        args,
        {
          getCursor: (node) => ({ id: node.id }),
          decodeCursor: (cursor) => ({ id: decodeGlobalIdStr(cursor).id }),
          encodeCursor: (cursor) => encodeGlobalId(cursor.id!, 'GatewayKey'),
        }
      );
    }
  },
  GatewayKey: {
    id: (obj: GatewayKey) => encodeGlobalId(obj.id, 'GatewayKey'),
  }
};
