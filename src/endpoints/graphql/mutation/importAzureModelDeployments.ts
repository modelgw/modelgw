import { getAllModelDeployments } from '@/lib/azure';
import { InferenceEndpointConst } from '@/lib/db/const';
import gql from 'graphql-tag';
import z from 'zod';
import { ImportAzureModelDeploymentsInput, ImportAzureModelDeploymentsPayload } from '../schema/generated/types/index';
import { zInferenceEndpointName } from '../schema/inferenceEndpoint';
import { ServerContext } from '../server-context';


export const importAzureModelDeploymentsTypeDefs = gql`
  extend type Mutation {
    importAzureModelDeployments(input: ImportAzureModelDeploymentsInput!): ImportAzureModelDeploymentsPayload
  }

  input ImportAzureModelDeploymentInput {
    inferenceEndpointName: String
    modelDeploymentId: String!
  }

  input ImportAzureModelDeploymentsInput {
    modelDeployments: [ImportAzureModelDeploymentInput!]!
  }

  type ImportAzureModelDeploymentsPayload {
    inferenceEndpoints: [InferenceEndpoint!]!
  }
`;

const ImportAzureModelDeploymentsInputSchema = z.object({
  modelDeployments: z.array(z.object({
    inferenceEndpointName: zInferenceEndpointName(),
    modelDeploymentId: z.string().min(1, 'Model Deployment ID is required'),
  })),
});

const resolve = async (
  _args,
  { input }: { input: ImportAzureModelDeploymentsInput },
  { logger, prismaClient }: ServerContext
): Promise<ImportAzureModelDeploymentsPayload> => {
  const values = await ImportAzureModelDeploymentsInputSchema.parseAsync(input);
  const allModelDeployments = await getAllModelDeployments();
  // find the model deployments that are in the input
  const modelDeployments = allModelDeployments.filter((modelDeployment) => {
    return values.modelDeployments.some((value) => value.modelDeploymentId === modelDeployment.id);
  });
  const inferenceEndpoints: Array<any> = [];
  for (const modelDeployment of modelDeployments) {
    logger.info({ modelDeployment: modelDeployment.id }, 'Importing Azure model deployment');
    // create the inference endpoint
    const inferenceEndpoint = await prismaClient.inferenceEndpoint.create({
      data: {
        name: values.modelDeployments.find((value) => value.modelDeploymentId === modelDeployment.id)!.inferenceEndpointName,
        platform: InferenceEndpointConst.Platform.AzureOpenAI,
        region: modelDeployment.accountLocation,
        endpoint: modelDeployment.accountEndpoint,
        key: modelDeployment.accountKey1,
        modelName: modelDeployment.modelDeploymentModelName,
        modelVersion: modelDeployment.modelDeploymentModelVersion,
        deploymentName: modelDeployment.modelDeploymentName,
        status: InferenceEndpointConst.Status.Active,
      },
    });
    inferenceEndpoints.push(inferenceEndpoint);
  }

  return { inferenceEndpoints };
};

export const importAzureModelDeploymentsResolvers = {
  Mutation: {
    importAzureModelDeployments: {
      resolve,
    }
  }
};
