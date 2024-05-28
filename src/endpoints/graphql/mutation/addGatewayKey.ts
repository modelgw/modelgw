import { PrismaClient } from '@/lib/db/client';
import { GatewayKeyConst } from '@/lib/db/const';
import bs58 from 'bs58';
import { createHash, randomUUID } from 'crypto';
import gql from 'graphql-tag';
import { z } from 'zod';
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
  }

  type AddGatewayKeyPayload {
    gatewayKey: GatewayKey
    key: String
  }
`;

export const AddGatewayKeyInputSchema = z.object({
  name: GatewayKeyValidations.name,
  gatewayId: GatewayValidations.gatewayId,
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
  _args,
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
