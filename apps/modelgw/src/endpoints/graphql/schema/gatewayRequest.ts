import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { GatewayRequest } from "@prisma/client";
import gql from 'graphql-tag';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr, encodeGlobalId } from '../utils';
import { QuerygatewayRequestsArgs } from './generated/types/index';

export const gatewayRequestTypeDefs = gql`
  extend type Query {
    gatewayRequests(after: String, first: Int, before: String, last: Int, filter: GatewayRequestFilter): GatewayRequestConnection
  }
  input GatewayRequestFilter {
    gatewayId: ID
    createdAt: DateTimeFilter
  }
  input DateTimeFilter {
    gte: String
    lte: String
  }
  type GatewayRequest implements Node {
    id: ID!
    ip: String!
    url: String!
    body: String
    contentType: String
    requestId: String!
    topP: Float
    tools: Boolean
    seed: Int
    stream: Boolean
    temperature: Float
    maxTokens: Int
    createdAt: String!
    gateway: Gateway!
    gatewayKey: GatewayKey!
    gatewayResponse: GatewayResponse
    inferenceEndpointRequests(after: String, first: Int, before: String, last: Int): InferenceEndpointRequestConnection
  }
  type GatewayResponse {
    id: ID!
    duration: Float!
    statusCode: Int!
    headers: JSONObject!
    body: String
    createdAt: String!
    inferenceEndpointResponse: InferenceEndpointResponse
  }
  type InferenceEndpointResponse {
    id: ID!
    statusCode: Int!
    duration: Float!
    headers: JSONObject!
    body: String
    choices: Int
    promptTokens: Int
    completionTokens: Int
    createdAt: String!
    inferenceEndpointRequest: InferenceEndpointRequest
  }
  type InferenceEndpointRequestConnection {
    edges: [InferenceEndpointRequestEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  type InferenceEndpointRequestEdge {
    node: InferenceEndpointRequest
    cursor: String!
  }
  type InferenceEndpointRequest {
    id: ID!
    url: String!
    method: String!
    body: String
    createdAt: String!
    inferenceEndpoint: InferenceEndpoint!
  }
  type GatewayRequestConnection {
    edges: [GatewayRequestEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  type GatewayRequestEdge {
    node: GatewayRequest
    cursor: String!
  }
`;

export const gatewayRequestResolvers = {
  Query: {
    gatewayRequests: async (_parent: any, args: QuerygatewayRequestsArgs, { prismaClient }: ServerContext, _info: any) => {
      return findManyCursorConnection(
        (findManyArgs) => prismaClient.gatewayRequest.findMany({
          ...findManyArgs,
          where: {
            gatewayId: args.filter?.gatewayId ? decodeGlobalIdStr(args.filter.gatewayId).id : undefined,
            createdAt: {
              gte: args.filter?.createdAt?.gte ? new Date(args.filter.createdAt.gte) : undefined,
              lte: args.filter?.createdAt?.lte ? new Date(args.filter.createdAt.lte) : undefined,
            },
          },
          include: {
            gateway: true,
            gatewayKey: true,
            gatewayResponse: {
              include: {
                inferenceEndpointResponse: {
                  include: {
                    inferenceEndpointRequest: {
                      include: {
                        inferenceEndpoint: true,
                      }
                    }
                  }
                }
              }
            },
          },
          orderBy: { createdAt: 'asc' },
        }),
        () => prismaClient.gatewayRequest.count(),
        args,
        {
          getCursor: (node) => ({ id: node.id }),
          decodeCursor: (cursor) => ({ id: decodeGlobalIdStr(cursor).id }),
          encodeCursor: (cursor) => encodeGlobalId(cursor.id!, 'GatewayRequest'),
        }
      );
    }
  },
  GatewayRequest: {
    id: (obj: GatewayRequest) => encodeGlobalId(obj.id, 'GatewayRequest'),
    inferenceEndpointRequests: async (parent: GatewayRequest, args: any, { prismaClient }: ServerContext, _info: any) => {
      return findManyCursorConnection(
        (findManyArgs) => prismaClient.inferenceEndpointRequest.findMany({
          ...findManyArgs,
          where: { gatewayRequestId: parent.id },
          include: { inferenceEndpoint: true },
          orderBy: { createdAt: 'asc' },
        }),
        () => prismaClient.inferenceEndpointRequest.count({
          where: { gatewayRequestId: parent.id }
        }),
        args,
        {
          getCursor: (node) => ({ id: node.id }),
          decodeCursor: (cursor) => ({ id: decodeGlobalIdStr(cursor).id }),
          encodeCursor: (cursor) => encodeGlobalId(cursor.id!, 'InferenceEndpointRequest'),
        }
      );
    }
  }
};
