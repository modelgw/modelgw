import gql from 'graphql-tag';
import { z } from 'zod';
import { GatewayKeyValidations } from '../schema/gatewayKey';
import { ResetGatewayKeyUsageInput } from '../schema/generated/types';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr } from '../utils';

export const resetGatewayKeyUsageTypeDefs = gql`
  extend type Mutation {
    resetGatewayKeyUsage(input: ResetGatewayKeyUsageInput!): ResetGatewayKeyUsagePayload
  }

  input ResetGatewayKeyUsageInput {
    gatewayKeyId: ID!
  }

  type ResetGatewayKeyUsagePayload {
    gatewayKey: GatewayKey
  }
`;

export const ResetGatewayKeyUsageInputSchema = z.object({
  gatewayKeyId: GatewayKeyValidations.gatewayKeyId,
});


const resolve = async (
  _args: any,
  { input }: { input: ResetGatewayKeyUsageInput },
  { logger, prismaClient }: ServerContext,
) => { //: Promise<ResetGatewayKeyUsagePayload> => {
  const values = await ResetGatewayKeyUsageInputSchema.parseAsync(input);
  logger.info(values, 'Reseting gateway key usage');
  const gatewayKey = await prismaClient.gatewayKey.update({
    data: {
      promptTokens: 0,
      completionTokens: 0,
      lastResetAt: new Date(),
    },
    where: { id: decodeGlobalIdStr(values.gatewayKeyId).id },
  });
  return { gatewayKey };
};

export const resetGatewayKeyUsageResolvers = {
  Mutation: {
    resetGatewayKeyUsage: {
      resolve,
    }
  }
};
