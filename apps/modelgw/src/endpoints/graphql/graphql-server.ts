import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { AggregateAuthenticationError } from '@azure/identity';
import { RequestHandler } from 'express';
import { GraphQLError, GraphQLErrorExtensions, GraphQLFormattedError } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { z, ZodError } from 'zod';
import { PrismaClient } from '../../lib/db/client';
import { logger } from '../../lib/logger';
import { permissions, UnauthorizedError } from './permissions';
import { schema } from './schema';
import { createServerContextMiddlewareOptionsAsync, ServerContext } from './server-context';
import { buildErrorObjectFromZodError, GraphQLValidationErrorExtensions } from './utils';

// override default error map to show custom error messages for specific errors
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
    if (issue.path[0] === 'platform' && ctx?.data?.platform === '') {
      return { message: 'Platform is required' };
    }
  }
  return { message: ctx.defaultError };
};
z.setErrorMap(customErrorMap);

function LogPlugin(): ApolloServerPlugin<ServerContext> {
  return {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext) {
      logger.debug({ query: requestContext.request.query }, 'Processing GraphQL request');
      return {
        // Fires whenever Apollo Server will parse a GraphQL request to create its associated document AST.
        async parsingDidStart(requestContext) {
          // logger.debug('GraphQL parsing started');
        },

        // Fires whenever Apollo Server will validate a request's document AST against your GraphQL schema.
        async validationDidStart(requestContext) {
          // logger.debug('GraphQL validation started');
        },
      };
    },
    async unexpectedErrorProcessingRequest({ error, }) {
      logger.error({ error }, 'Unexpected error processing request');
    },
    async invalidRequestWasReceived({ error }) {
      logger.error({ error }, 'Invalid request received');
    },
  };
}

const server = new ApolloServer<ServerContext>({
  schema: applyMiddleware(schema, permissions),
  plugins: [LogPlugin()],
  formatError: (formattedError, error): GraphQLFormattedError => {
    const originalError = unwrapResolverError(error);
    if (originalError instanceof ZodError) {
      const extensions: GraphQLValidationErrorExtensions = {
        validationErrors: buildErrorObjectFromZodError(originalError),
        code: 'INVALID_INPUT',
      };
      return new GraphQLError('Invalid input', { extensions });
    } else if (originalError instanceof UnauthorizedError) {
      const extensions: GraphQLErrorExtensions = {
        code: 'UNAUTHORIZED',
      };
      return new GraphQLError('Unauthorized', { extensions, path: formattedError.path });
    } else if (originalError instanceof AggregateAuthenticationError) {
      logger.error('Azure authentication error %s', originalError);
      const extensions: GraphQLErrorExtensions = {
        code: 'AZURE_AUTHENTICATION_ERROR',
      };
      return new GraphQLError(originalError.message, { extensions, path: formattedError.path });
    }
    logger.error('Unexpected error %s', originalError);
    return formattedError;
  },
});

export const graphqlServer = server;

export const createGraphqlServerMiddlewareAsync = async (prismaClient: PrismaClient): Promise<RequestHandler> => {
  const options = await createServerContextMiddlewareOptionsAsync(prismaClient);
  return expressMiddleware<ServerContext>(server, options);
};
