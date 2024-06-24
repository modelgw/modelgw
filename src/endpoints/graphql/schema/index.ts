import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { JSONObjectDefinition } from 'graphql-scalars';
import { addGatewayKeyResolvers, addGatewayKeyTypeDefs } from '../mutation/addGatewayKey';
import { createGatewayResolvers, createGatewayTypeDefs } from '../mutation/createGateway';
import { createInferenceEndpointResolvers, createInferenceEndpointTypeDefs } from '../mutation/createInferenceEndpoint';
import { importAzureModelDeploymentsResolvers, importAzureModelDeploymentsTypeDefs } from '../mutation/importAzureModelDeployments';
import { loginResolvers, loginTypeDefs } from '../mutation/login';
import { logoutResolvers, logoutTypeDefs } from '../mutation/logout';
import { revokeGatewayKeyResolvers, revokeGatewayKeyTypeDefs } from '../mutation/revokeGatewayKey';
import { updateGatewayResolvers, updateGatewayTypeDefs } from '../mutation/updateGateway';
import { updateInferenceEndpointResolvers, updateInferenceEndpointTypeDefs } from '../mutation/updateInferenceEndpoint';
import { azureModelDeploymentResolvers, azureModelDeploymentTypeDefs } from './azure';
import { baseResolvers, baseTypeDefs } from './base';
import { gatewayResolvers, gatewayTypeDefs } from './gateway';
import { gatewayKeyResolvers, gatewayKeyTypeDefs } from './gatewayKey';
import { gatewayRequestResolvers, gatewayRequestTypeDefs } from './gatewayRequest';
import { inferenceEndpointResolvers, inferenceEndpointTypeDefs } from './inferenceEndpoint';
import { viewerResolvers, viewerTypeDefs } from './viewer';


const typeDefs = mergeTypeDefs([
  // Scalars
  JSONObjectDefinition,
  // Query
  azureModelDeploymentTypeDefs,
  baseTypeDefs,
  gatewayTypeDefs,
  gatewayKeyTypeDefs,
  gatewayRequestTypeDefs,
  inferenceEndpointTypeDefs,
  viewerTypeDefs,
  // Mutations
  addGatewayKeyTypeDefs,
  createGatewayTypeDefs,
  createInferenceEndpointTypeDefs,
  importAzureModelDeploymentsTypeDefs,
  loginTypeDefs,
  logoutTypeDefs,
  revokeGatewayKeyTypeDefs,
  updateGatewayTypeDefs,
  updateInferenceEndpointTypeDefs,
]);

const resolvers = mergeResolvers([
  // Query
  azureModelDeploymentResolvers,
  baseResolvers,
  gatewayResolvers,
  gatewayKeyResolvers,
  gatewayRequestResolvers,
  inferenceEndpointResolvers,
  viewerResolvers,
  // Mutations
  addGatewayKeyResolvers,
  createGatewayResolvers,
  createInferenceEndpointResolvers,
  importAzureModelDeploymentsResolvers,
  loginResolvers,
  logoutResolvers,
  revokeGatewayKeyResolvers,
  updateGatewayResolvers,
  updateInferenceEndpointResolvers,
]);

export const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });
