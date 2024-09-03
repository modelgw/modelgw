import gql from 'graphql-tag';
import { z } from 'zod';
import { GatewayKeyConst } from '../../../lib/db/const';
import { GatewayKeyValidations } from '../schema/gatewayKey';
import { RevokeGatewayKeyInput } from '../schema/generated/types';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr } from '../utils';

export const revokeGatewayKeyTypeDefs = gql`
  extend type Mutation {
    revokeGatewayKey(input: RevokeGatewayKeyInput!): RevokeGatewayKeyPayload
  }

  input RevokeGatewayKeyInput {
    gatewayKeyId: ID!
  }

  type RevokeGatewayKeyPayload {
    gatewayKey: GatewayKey
  }
`;

export const RevokeGatewayKeyInputSchema = z.object({
  gatewayKeyId: GatewayKeyValidations.gatewayKeyId,
});

const resolve = async (
  _args: any,
  { input }: { input: RevokeGatewayKeyInput },
  { logger, prismaClient }: ServerContext,
) => { //: Promise<RevokeGatewayKeyPayload> => {
  const values = await RevokeGatewayKeyInputSchema.parseAsync(input);
  logger.info({ input }, 'Revoking gateway key');
  const gatewayKey = await prismaClient.gatewayKey.update({
    where: {
      id: decodeGlobalIdStr(values.gatewayKeyId).id,
    },
    data: {
      status: GatewayKeyConst.Status.Revoked,
    },
  });
  return { gatewayKey };
};

export const revokeGatewayKeyResolvers = {
  Mutation: {
    revokeGatewayKey: {
      resolve,
    }
  }
};
