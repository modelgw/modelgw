import gql from 'graphql-tag';
import z from 'zod';
import { PrismaClient } from '../../../lib/db/client';
import { InferenceEndpointConst } from '../../../lib/db/const';
import { zOptionalString } from '../schema/base';
import { UpdateInferenceEndpointInput } from '../schema/generated/types';
import { AzureOpenAISchema, BaseValidationWithIdSchema, CustomSchema, HuggingfaceSchema, OllamaSchema, OpenAISchema } from '../schema/inferenceEndpoint';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr } from '../utils';

export const updateInferenceEndpointTypeDefs = gql`
  extend type Mutation {
    updateInferenceEndpoint(input: UpdateInferenceEndpointInput!): UpdateInferenceEndpointPayload
  }

  input UpdateInferenceEndpointInput {
    inferenceEndpointId: ID!
    name: String!
    platform: String!
    region: String
    endpoint: String
    key: String
    modelName: String
    modelVersion: String
    deploymentName: String
  }

  type UpdateInferenceEndpointPayload {
    inferenceEndpoint: InferenceEndpoint
  }
`;


function createUpdateInferenceEndpointInputSchema(prismaClient: PrismaClient) {
  const UpdateInferenceEndpointInputSchema = z.discriminatedUnion('platform', [
    z.object(BaseValidationWithIdSchema).extend(AzureOpenAISchema).merge(z.object({
      key: zOptionalString(),
    })),
    z.object(BaseValidationWithIdSchema).extend(CustomSchema),
    z.object(BaseValidationWithIdSchema).extend(HuggingfaceSchema),
    z.object(BaseValidationWithIdSchema).extend(OllamaSchema),
    z.object(BaseValidationWithIdSchema).extend(OpenAISchema).merge(z.object({
      key: zOptionalString(),
    })),
  ]).superRefine(async (val, ctx) => {
    // require key if it's not already saved
    if (InferenceEndpointConst.Platform.OpenAI == val.platform || InferenceEndpointConst.Platform.AzureOpenAI == val.platform) {
      const count = await prismaClient.inferenceEndpoint.count({
        where: {
          id: decodeGlobalIdStr(val.inferenceEndpointId).id,
          key: { equals: null }
        }
      });
      const existsOrProvided = count == 0 || !!('key' in val && val.key); // key already saved or key is provided
      if (!existsOrProvided) {
        ctx.addIssue({
          path: ['key'],
          code: z.ZodIssueCode.custom,
          message: 'Key is required',
        });
        return z.INVALID;
      }
    }
  }).and(z.object(BaseValidationWithIdSchema));
  return UpdateInferenceEndpointInputSchema;
}

const resolve = async (_args: any, { input }: { input: UpdateInferenceEndpointInput }, { logger, prismaClient }: ServerContext) => {
  const UpdateInferenceEndpointInputSchema = createUpdateInferenceEndpointInputSchema(prismaClient);
  const values = await UpdateInferenceEndpointInputSchema.parseAsync(input);
  logger.info({ ...values, key: 'REDACTED' }, 'Updating inference endpoint');
  const { inferenceEndpointId, ...data } = values;
  const inferenceEndpoint = await prismaClient.inferenceEndpoint.update({
    data: {
      // default values (clears out the previous values if not provided)
      region: null,
      modelName: null,
      modelVersion: null,
      deploymentName: null,
      ...data,
      // update key only if provided
      key: ('key' in values ? values.key : undefined) ?? undefined,
    },
    where: { id: decodeGlobalIdStr(values.inferenceEndpointId).id },
  });
  return { inferenceEndpoint };
};

export const updateInferenceEndpointResolvers = {
  Mutation: {
    updateInferenceEndpoint: {
      resolve,
    }
  }
};
