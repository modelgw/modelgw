import { GatewayConst, InferenceEndpointConst } from '@/lib/db/const';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Gateway } from "@prisma/client";
import gql from 'graphql-tag';
import z from 'zod';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr, encodeGlobalId } from '../utils';
import { zId, zKebabCaseString } from './base';

export const gatewayTypeDefs = gql`
  extend type Query {
    gateways(after: String, first: Int, before: String, last: Int): GatewayConnection
  }
  type Gateway implements Node {
    id: ID!
    name: String!
    status: String!

    createdAt: String!
    updatedAt: String!
  }
  type GatewayConnection {
    edges: [GatewayEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  type GatewayEdge {
    node: Gateway
    cursor: String!
  }
`;


export const GatewayValidations = {
  gatewayId: zId(),
  name: zKebabCaseString(z.string().min(1, 'Name is required').max(64, 'Name is too long')),
};


export const gatewayResolvers = {
  Query: {
    gateways: async (_parent, args, { prismaClient, logger }: ServerContext, _info) => {
      logger.info('Fetching gateways');
      return findManyCursorConnection(
        (findManyArgs) => prismaClient.gateway.findMany({
          ...findManyArgs,
          include: {
            inferenceEndpoints: { select: { inferenceEndpoint: { select: { status: true } } } },
          },
          orderBy: { name: 'asc' },
        }),
        () => prismaClient.gateway.count(),
        args,
        {
          getCursor: (node) => ({ id: node.id }),
          decodeCursor: (cursor) => ({ id: decodeGlobalIdStr(cursor).id }),
          encodeCursor: (cursor) => encodeGlobalId(cursor.id!, 'Gateway'),
        }
      );
    }
  },
  Gateway: {
    id: (obj: Gateway) => encodeGlobalId(obj.id, 'Gateway'),
    status: (obj: Gateway & {
      inferenceEndpoints: {
        inferenceEndpoint: {
          status: string;
        };
      }[];
    }) => {
      const statuses = obj.inferenceEndpoints.map(endpoint => endpoint.inferenceEndpoint.status);
      if (statuses.includes(InferenceEndpointConst.Status.Active)) return GatewayConst.Status.Active;
      if (statuses.includes(InferenceEndpointConst.Status.Throttling)) return GatewayConst.Status.Throttling;
      if (statuses.includes(InferenceEndpointConst.Status.Error)) return GatewayConst.Status.Error;
      return GatewayConst.Status.Inactive;
    },
  }
};
