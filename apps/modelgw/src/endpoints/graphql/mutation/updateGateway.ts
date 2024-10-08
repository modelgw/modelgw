import gql from 'graphql-tag';
import { z } from 'zod';
import { GatewayValidations } from '../schema/gateway';
import { UpdateGatewayInput } from '../schema/generated/types';
import { InferenceEndpointValidations } from '../schema/inferenceEndpoint';
import { ServerContext } from '../server-context';
import { decodeGlobalIdStr } from '../utils';

export const updateGatewayTypeDefs = gql`
  extend type Mutation {
    updateGateway(input: UpdateGatewayInput!): UpdateGatewayPayload
  }

  input UpdateGatewayInput {
    gatewayId: ID!
    name: String!
    traceTraffic: Boolean!
    tracePayload: Boolean!
    logTraffic: Boolean!
    logPayload: Boolean!
    inferenceEndpointIds: [ID!]!
  }

  type UpdateGatewayPayload {
    gateway: Gateway
  }
`;

export const UpdateGatewayInputSchema = z.object({
  gatewayId: GatewayValidations.gatewayId,
  name: GatewayValidations.name,
  traceTraffic: z.boolean(),
  tracePayload: z.boolean(),
  logTraffic: z.boolean(),
  logPayload: z.boolean(),
  inferenceEndpointIds: z.array(InferenceEndpointValidations.inferenceEndpointId),
});

const resolve = async (
  _args: any,
  { input }: { input: UpdateGatewayInput },
  { logger, prismaClient }: ServerContext,
) => { //: Promise<UpdateGatewayPayload> => {
  const values = await UpdateGatewayInputSchema.parseAsync(input);
  const inferenceEndpointIds = values.inferenceEndpointIds.map((id) => decodeGlobalIdStr(id).id);
  logger.info({ values, inferenceEndpointIds }, 'Updating gateway');
  const gatewayId = decodeGlobalIdStr(values.gatewayId).id;
  const gateway = await prismaClient.gateway.update({
    data: {
      name: values.name,
      traceTraffic: values.traceTraffic,
      tracePayload: values.tracePayload && values.traceTraffic,
      logTraffic: values.logTraffic,
      logPayload: values.logPayload && values.logTraffic,
    },
    where: { id: gatewayId },
  });

  await prismaClient.gatewayInferenceEndpoint.deleteMany({
    where: {
      gatewayId,
      inferenceEndpointId: { notIn: inferenceEndpointIds },
    },
  });
  const gatewayInferenceEndpoints = await prismaClient.gatewayInferenceEndpoint.findMany({
    where: {
      gatewayId,
    },
  });
  const gatewayInferenceEndpointIds = gatewayInferenceEndpoints.map((gie) => gie.inferenceEndpointId);
  await prismaClient.gatewayInferenceEndpoint.createMany({
    data: inferenceEndpointIds
      .filter(inferenceEndpointId => !gatewayInferenceEndpointIds.includes(inferenceEndpointId))
      .map((inferenceEndpointId, index) => ({
        inferenceEndpointId,
        gatewayId,
        order: index,
      })),
    skipDuplicates: true,
  });

  return { gateway };
};

export const updateGatewayResolvers = {
  Mutation: {
    updateGateway: {
      resolve,
    }
  }
};
