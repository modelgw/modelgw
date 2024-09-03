import gql from 'graphql-tag';
import { z } from 'zod';
import { GatewayConst } from '../../../lib/db/const';
import { GatewayValidations } from '../schema/gateway';
import { CreateGatewayInput } from '../schema/generated/types';
import { ServerContext } from '../server-context';

export const createGatewayTypeDefs = gql`
  extend type Mutation {
    createGateway(input: CreateGatewayInput!): CreateGatewayPayload
  }

  input CreateGatewayInput {
    name: String!
  }

  type CreateGatewayPayload {
    gateway: Gateway
  }
`;

export const CreateGatewayInputSchema = z.object({
  name: GatewayValidations.name,
});

const resolve = async (
  _args: any,
  { input }: { input: CreateGatewayInput },
  { logger, prismaClient }: ServerContext,
) => { //: Promise<CreateGatewayPayload> => {
  const values = await CreateGatewayInputSchema.parseAsync(input);
  logger.info(values, 'Creating gateway');
  const gateway = await prismaClient.gateway.create({
    data: {
      name: values.name,
    },
  });
  return { gateway: { ...gateway, status: GatewayConst.Status.Inactive } };
};

export const createGatewayResolvers = {
  Mutation: {
    createGateway: {
      resolve,
    }
  }
};
