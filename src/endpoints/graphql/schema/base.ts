import { GraphQLResolveInfo } from 'graphql';
import gql from 'graphql-tag';
import { z } from 'zod';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr } from '../utils';

export const baseTypeDefs = gql`
  type Query {
    node(id: ID!): Node
  }
  type Mutation {
    _empty: String
  }
  interface Node {
    id: ID!
  }
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }
`;

const resolve = async (_parent, args, { prismaClient, logger }: ServerContext, _info: GraphQLResolveInfo) => {
  const { __typename, id } = decodeGlobalIdStr(args.id);
  logger.debug({ __typename, id, nodeId: args.id }, 'Resolving GraphQL node');
  let node: any = {};
  if (__typename == 'Gateway') {
    node = await prismaClient.gateway.findUnique({ where: { id } });
  } else if (__typename == 'InferenceEndpoint') {
    node = await prismaClient.inferenceEndpoint.findUnique({ where: { id } });
  } else {
    logger.warn({ __typename, id }, 'Type not found');
    return null;
  }
  return {
    ...node,
    __typename,
  };
};

export const baseResolvers = {
  Query: {
    node: resolve,
  },
};

export function zId() {
  return z.string().min(1, 'ID is required').refine((id) => {
    try {
      decodeGlobalIdStr(id);
      return true;
    } catch (err) {
      return false;
    }
  }, 'Invalid ID');
}

export function zKebabCaseString(base: z.ZodString = z.string()) {
  return base.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'Only lowercase letters, numbers, and hyphens are allowed. Must start and end with a letter or number.'
  });
}

export function zOptionalString() {
  return z.string().trim().optional().nullable().transform((val) => val === '' ? null : (val ?? null));
}
