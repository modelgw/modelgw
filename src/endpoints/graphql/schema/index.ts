import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
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
import { inferenceEndpointResolvers, inferenceEndpointTypeDefs } from './inferenceEndpoint';
import { viewerResolvers, viewerTypeDefs } from './viewer';


const typeDefs = mergeTypeDefs([
  azureModelDeploymentTypeDefs,
  baseTypeDefs,
  gatewayTypeDefs,
  gatewayKeyTypeDefs,
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
  azureModelDeploymentResolvers,
  baseResolvers,
  gatewayResolvers,
  gatewayKeyResolvers,
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
