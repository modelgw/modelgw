import gql from 'graphql-tag';
import { z } from 'zod';
import { revokeGatewayKeyRecursively } from '../../gateway/utils';
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
    gatewayKeys: [GatewayKey!]!
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
  const revokedKeys = await revokeGatewayKeyRecursively(prismaClient, decodeGlobalIdStr(values.gatewayKeyId).id);
  return { gatewayKeys: revokedKeys };
};

export const revokeGatewayKeyResolvers = {
  Mutation: {
    revokeGatewayKey: {
      resolve,
    }
  }
};
