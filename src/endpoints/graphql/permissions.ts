import { allow, deny, rule, shield } from 'graphql-shield';

const isAuthenticated = rule({ cache: 'contextual' })(async (_parent, _args, ctx, _info) => {
  ctx.logger.debug({ user: ctx.user, result: !!ctx.user }, 'Checking authentication');
  return !!ctx.user;
});

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export const permissions = shield({
  Query: {
    '*': deny,
    azureModelDeployments: isAuthenticated,
    gateways: isAuthenticated,
    inferenceEndpoints: isAuthenticated,
    node: isAuthenticated,
    viewer: isAuthenticated,
  },
  Mutation: {
    '*': deny,
    login: allow,
    logout: allow,
    // Gateway
    createGateway: isAuthenticated,
    updateGateway: isAuthenticated,
    // Gateway Key
    addGatewayKey: isAuthenticated,
    revokeGatewayKey: isAuthenticated,
    // Infernce Endpoint
    createInferenceEndpoint: isAuthenticated,
    updateInferenceEndpoint: isAuthenticated,
    importAzureModelDeployments: isAuthenticated,
  },
}, {
  allowExternalErrors: true,
  debug: process.env.NODE_ENV === 'development',
  fallbackError: new UnauthorizedError(),
});
