import bs58 from 'bs58';
import { createHash, randomUUID } from 'crypto';
import gql from 'graphql-tag';
import { z } from 'zod';
import { PrismaClient } from '../../../lib/db/client';
import { GatewayKeyConst } from '../../../lib/db/const';
import { GatewayValidations } from '../schema/gateway';
import { GatewayKeyValidations } from '../schema/gatewayKey';
import { AddGatewayKeyInput } from '../schema/generated/types';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr } from '../utils';

export const addGatewayKeyTypeDefs = gql`
  extend type Mutation {
    addGatewayKey(input: AddGatewayKeyInput!): AddGatewayKeyPayload
  }

  input AddGatewayKeyInput {
    gatewayId: ID!
    name: String!
    promptTokensLimit: Int
    completionTokensLimit: Int
    resetFrequency: String
    parentGatewayKeyId: ID
  }

  type AddGatewayKeyPayload {
    gatewayKey: GatewayKey
    key: String
  }
`;

export const AddGatewayKeyInputSchema = z.object({
  name: GatewayKeyValidations.name,
  gatewayId: GatewayValidations.gatewayId,
  promptTokensLimit: GatewayKeyValidations.promptTokensLimit,
  completionTokensLimit: GatewayKeyValidations.completionTokensLimit,
  resetFrequency: GatewayKeyValidations.resetFrequency,
  parentGatewayKeyId: GatewayKeyValidations.parentGatewayKeyId,
}).superRefine(async (val, ctx) => {
  if ((val.promptTokensLimit || val.completionTokensLimit) && !val.resetFrequency) {
    ctx.addIssue({
      path: ['resetFrequency'],
      code: z.ZodIssueCode.custom,
      message: 'Reset frequency is required',
    });
    return z.INVALID;
  }
});

async function generateKey(prismaClient: PrismaClient) {
  do {
    var key = 'sk-' + bs58.encode(createHash('sha256').update(randomUUID()).digest());
    var keyHash = createHash('sha256').update(key).digest('hex');
  } while (await prismaClient.gatewayKey.count({ where: { keyHash } }) !== 0);
  return {
    key,
    keyHash,
    maskedKey: key.slice(0, 3) + '...' + key.slice(-3),
  };
}

const resolve = async (
  _args: any,
  { input }: { input: AddGatewayKeyInput },
  { logger, prismaClient }: ServerContext,
) => { //: Promise<AddGatewayKeyPayload> => {
  const values = await AddGatewayKeyInputSchema.parseAsync(input);
  logger.info(values, 'Adding gateway key');
  const { key, keyHash, maskedKey } = await generateKey(prismaClient);
  const gatewayKey = await prismaClient.gatewayKey.create({
    data: {
      name: values.name,
      keyHash,
      maskedKey,
      promptTokensLimit: values.promptTokensLimit,
      completionTokensLimit: values.completionTokensLimit,
      resetFrequency: values.resetFrequency,
      parentId: values.parentGatewayKeyId ? decodeGlobalIdStr(values.parentGatewayKeyId).id : null,
      gatewayId: decodeGlobalIdStr(values.gatewayId).id,
      status: GatewayKeyConst.Status.Active,
    },
  });
  return { gatewayKey, key };
};

export const addGatewayKeyResolvers = {
  Mutation: {
    addGatewayKey: {
      resolve,
    }
  }
};
