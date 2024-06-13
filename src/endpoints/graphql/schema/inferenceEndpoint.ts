import { InferenceEndpointConst } from '@/lib/db/const';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { InferenceEndpoint } from "@prisma/client";
import gql from 'graphql-tag';
import z from 'zod';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr, encodeGlobalId } from '../utils';
import { zId, zKebabCaseString, zOptionalString } from './base';
import { Gateway } from './generated/types';


export const inferenceEndpointTypeDefs = gql`
  extend type Query {
    inferenceEndpoints(after: String, first: Int, before: String, last: Int): InferenceEndpointConnection
  }
  type InferenceEndpoint implements Node {
    id: ID!
    name: String!
    platform: String!
    region: String
    endpoint: String!
    modelName: String
    modelVersion: String
    deploymentName: String
    status: String!

    createdAt: String!
    updatedAt: String!
  }
  type InferenceEndpointConnection {
    edges: [InferenceEndpointEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  type InferenceEndpointEdge {
    node: InferenceEndpoint
    cursor: String!
  }

  extend type Gateway {
    inferenceEndpoints(after: String, first: Int, before: String, last: Int): GatewayInferenceEndpointConnection
  }
  type GatewayInferenceEndpointConnection {
    edges: [GatewayInferenceEndpointEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  type GatewayInferenceEndpointEdge {
    node: InferenceEndpoint
    order: Int!
    cursor: String!
  }
`;

export function zInferenceEndpointName() {
  return zKebabCaseString(z.string().min(1, 'Name is required').max(64, 'Name is too long'));
}

export const InferenceEndpointValidations = {
  inferenceEndpointId: zId(),
  name: zInferenceEndpointName(),
  platform: z.string().trim().min(1, 'Platform is required'),
  region: z.string().trim().min(1, 'Region is required'),
  endpoint: z.string().trim().min(1, 'Endpoint is required').url('Endpoint must be a valid URL'),
  key: z.string().trim().min(1, 'Key is required'),
  modelName: z.string().trim().min(1, 'Model name is required'),
  modelVersion: z.string().trim().min(1, 'Model version is required'),
  deploymentName: z.string().trim().min(1, 'Deployment name is required'),
};

export const BaseValidationSchema = {
  name: InferenceEndpointValidations.name,
  platform: InferenceEndpointValidations.platform,
  endpoint: InferenceEndpointValidations.endpoint,
};

export const BaseValidationWithIdSchema = {
  ...BaseValidationSchema,
  inferenceEndpointId: InferenceEndpointValidations.inferenceEndpointId,
};

export const AzureOpenAISchema = {
  platform: z.literal(InferenceEndpointConst.Platform.AzureOpenAI),
  region: InferenceEndpointValidations.region,
  modelName: InferenceEndpointValidations.modelName,
  modelVersion: InferenceEndpointValidations.modelVersion,
  deploymentName: InferenceEndpointValidations.deploymentName,
  key: InferenceEndpointValidations.key,
};

export const CustomSchema = {
  platform: z.literal(InferenceEndpointConst.Platform.Custom),
  region: zOptionalString(),
  key: zOptionalString(),
  modelName: zOptionalString(),
  modelVersion: zOptionalString(),
};

export const HuggingfaceSchema = {
  platform: z.literal(InferenceEndpointConst.Platform.HuggingfaceInferenceEnpoints),
  key: InferenceEndpointValidations.key,
};

export const OllamaSchema = {
  platform: z.literal(InferenceEndpointConst.Platform.Ollama),
};

export const OpenAISchema = {
  platform: z.literal(InferenceEndpointConst.Platform.OpenAI),
  key: InferenceEndpointValidations.key,
};


export const inferenceEndpointResolvers = {
  Query: {
    inferenceEndpoints: async (_parent, args, { user, prismaClient }: ServerContext, _info) => {
      return findManyCursorConnection(
        (findManyArgs) => prismaClient.inferenceEndpoint.findMany({
          ...findManyArgs,
          orderBy: { name: 'asc' },
        }),
        () => prismaClient.inferenceEndpoint.count(),
        args,
        {
          getCursor: (node) => ({ id: node.id }),
          decodeCursor: (cursor) => ({ id: decodeGlobalIdStr(cursor).id }),
          encodeCursor: (cursor) => encodeGlobalId(cursor.id!, 'InferenceEndpoint'),
        }
      );
    }
  },
  Gateway: {
    inferenceEndpoints: async (parent: Gateway, args, { user, prismaClient: prisma }: ServerContext, _info) => {
      return findManyCursorConnection(
        (findManyArgs) => prisma.inferenceEndpoint.findMany({
          ...findManyArgs,
          where: {
            gateways: {
              some: {
                gatewayId: parent.id,
              }
            },
          },
          include: {
            gateways: true
          }
        }),
        () => prisma.inferenceEndpoint.count({
          where: {
            gateways: {
              some: {
                gatewayId: parent.id,
              }
            },
          }
        }),
        args,
        {
          getCursor: (node) => ({ id: node.id }),
          decodeCursor: (cursor) => ({ id: decodeGlobalIdStr(cursor).id }),
          encodeCursor: (cursor) => encodeGlobalId(cursor.id!, 'GatewayInferenceEndpoint'),
          recordToEdge: (record) => ({
            node: record,
            order: record.gateways[0].order,
          }),
        }
      );
    }
  },
  InferenceEndpoint: {
    id: (obj: InferenceEndpoint) => encodeGlobalId(obj.id, 'InferenceEndpoint'),
  }
};
