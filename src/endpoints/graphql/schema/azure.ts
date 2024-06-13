import { AzureModelDeployment, getAllModelDeployments } from '@/lib/azure';
import { InferenceEndpointConst } from '@/lib/db/const';
import gql from 'graphql-tag';
import { ServerContext } from '../server-context';


export const azureModelDeploymentTypeDefs = gql`
  extend type Query {
    azureModelDeployments: [AzureModelDeployment!]!
  }
  type AzureModelDeployment {
    id: ID!
    subscriptionId: String!
    resourceGroupName: String!
    accountName: String!
    accountLocation: String!
    accountEndpoint: String!
    modelDeploymentName: String!
    modelDeploymentModelName: String!
    modelDeploymentModelVersion: String!
  }
`;

const resolve = async (_parent, _args, { prismaClient }: ServerContext, _info) => {
  const azureModelDeployments = await getAllModelDeployments();
  const result: AzureModelDeployment[] = [];
  for (const azureModelDeployment of azureModelDeployments) {
    const count = await prismaClient.inferenceEndpoint.count({
      where: {
        platform: InferenceEndpointConst.Platform.AzureOpenAI,
        deploymentName: azureModelDeployment.modelDeploymentName,
        endpoint: azureModelDeployment.accountEndpoint,
        modelName: azureModelDeployment.modelDeploymentModelName,
        modelVersion: azureModelDeployment.modelDeploymentModelVersion,
        region: azureModelDeployment.accountLocation,
      },
    });
    if (count === 0) {
      result.push(azureModelDeployment);
    }
  }

  return result;
};

export const azureModelDeploymentResolvers = {
  Query: {
    azureModelDeployments: resolve,
  },
};
