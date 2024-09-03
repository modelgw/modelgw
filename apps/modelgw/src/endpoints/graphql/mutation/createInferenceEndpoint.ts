import gql from 'graphql-tag';
import { z } from 'zod';
import { InferenceEndpointConst } from '../../../lib/db/const';
import { CreateInferenceEndpointInput } from '../schema/generated/types';
import { AzureOpenAISchema, BaseValidationSchema, CustomSchema, HuggingfaceSchema, OllamaSchema, OpenAISchema } from '../schema/inferenceEndpoint';
import { ServerContext } from '../server-context';


export const createInferenceEndpointTypeDefs = gql`
  extend type Mutation {
    createInferenceEndpoint(input: CreateInferenceEndpointInput!): CreateInferenceEndpointPayload
  }

  input CreateInferenceEndpointInput {
    name: String!
    platform: String!
    region: String
    endpoint: String!
    key: String
    modelName: String
    modelVersion: String
    deploymentName: String
  }

  type CreateInferenceEndpointPayload {
    inferenceEndpoint: InferenceEndpoint
  }
`;

const CreateInferenceEndpointInputSchema = z.discriminatedUnion('platform', [
  z.object(BaseValidationSchema).extend(AzureOpenAISchema),
  z.object(BaseValidationSchema).extend(CustomSchema),
  z.object(BaseValidationSchema).extend(HuggingfaceSchema),
  z.object(BaseValidationSchema).extend(OllamaSchema),
  z.object(BaseValidationSchema).extend(OpenAISchema),
]).and(z.object(BaseValidationSchema));

const resolve = async (_args: any, { input }: { input: CreateInferenceEndpointInput }, { logger, prismaClient }: ServerContext) => {
  const values = await CreateInferenceEndpointInputSchema.parseAsync(input);
  logger.info({ ...values, key: 'REDACTED' }, 'Creating inference endpoint');
  const inferenceEndpoint = await prismaClient.inferenceEndpoint.create({
    // TODO: fix types check
    // @ts-ignore
    data: {
      ...values,
      status: InferenceEndpointConst.Status.Active,
    },
  });
  return { inferenceEndpoint };
};

export const createInferenceEndpointResolvers = {
  Mutation: {
    createInferenceEndpoint: {
      resolve,
    }
  }
};
