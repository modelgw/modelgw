import { Request } from "express";
import { isNumber } from "lodash";
import { HeadersInit } from "node-fetch";
import { PrismaClient } from "../../lib/db/client";
import { GatewayKeyConst, InferenceEndpointConst } from "../../lib/db/const";
import { logger } from "../../lib/logger";


export function createHeadersFromRequest(req: Request) {
  const safeHeaders = ["accept", "content-type", "content-encoding", "connection"];
  const headersInit: HeadersInit = {};
  safeHeaders.forEach((name) => {
    const reqHeaderValue = req.headers[name];
    if (reqHeaderValue) {
      headersInit[name] = Array.isArray(reqHeaderValue) ? reqHeaderValue[0] : reqHeaderValue;
    }
  });
  return headersInit;
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function setEndpointStatus(
  endpointId: string,
  status: typeof InferenceEndpointConst.Status[keyof typeof InferenceEndpointConst.Status],
  retryAfterSec: number | null = null,
  errorMessage: string | null = null,
  prismaClient: PrismaClient,
) {
  return prismaClient.inferenceEndpoint.update({
    data: {
      status,
      retryAfter: retryAfterSec ? new Date(Date.now() + 1000 * (retryAfterSec + 1)) : null,
      errorMessage,
    },
    where: {
      id: endpointId
    }
  });
}

export async function resetThrottlingEndpoints(prismaClient: PrismaClient) {
  return prismaClient.inferenceEndpoint.updateMany({
    data: {
      status: InferenceEndpointConst.Status.Active,
      retryAfter: null,
      errorMessage: null,
    },
    where: {
      status: { in: [InferenceEndpointConst.Status.Throttling, InferenceEndpointConst.Status.Error] },
      retryAfter: {
        not: null,
        lte: new Date()
      }
    }
  });
}

/** 
 * Check if the gateway key has reached the usage limits for prompt and completion tokens.
 * @returns true if the usage limits have been reached, false otherwise.
 */
export async function tokensUsageLimitsReached(prismaClient: PrismaClient, gatewayKeyId: string) {
  const gatewayKey = await prismaClient.gatewayKey.findFirstOrThrow({
    where: { id: gatewayKeyId },
    include: { parent: true },
  });

  if (isNumber(gatewayKey.promptTokensLimit) && gatewayKey.promptTokens >= gatewayKey.promptTokensLimit) {
    return 'prompt';
  }
  if (isNumber(gatewayKey.completionTokensLimit) && gatewayKey.completionTokens >= gatewayKey.completionTokensLimit) {
    return 'completion';
  }

  if (gatewayKey.parentId) {
    return await tokensUsageLimitsReached(prismaClient, gatewayKey.parentId);
  }
  return false;
}


export async function incrementTokensUsageRecursively(
  prismaClient: PrismaClient,
  gatewayKeyId: string,
  incrementPromptTokens: number,
  incrementCompletionTokens: number) {
  const gatewayKey = await prismaClient.gatewayKey.update({
    where: { id: gatewayKeyId },
    data: {
      promptTokens: { increment: incrementPromptTokens },
      completionTokens: { increment: incrementCompletionTokens },
    },
  });

  // Record in history
  await prismaClient.gatewayKeyUsageHistory.create({
    data: {
      gatewayKeyId,
      date: new Date(),
      promptTokens: incrementPromptTokens,
      completionTokens: incrementCompletionTokens,
    },
  });

  if (gatewayKey.parentId) {
    await incrementTokensUsageRecursively(prismaClient, gatewayKey.parentId, incrementPromptTokens, incrementCompletionTokens);
  }
}

export async function revokeGatewayKeyRecursively(prismaClient: PrismaClient, gatewayKeyId: string) {
  logger.info({ gatewayKey: { id: gatewayKeyId } }, 'Revoking gateway key');
  const gatewayKey = await prismaClient.gatewayKey.update({
    where: { id: gatewayKeyId },
    data: {
      status: GatewayKeyConst.Status.Revoked,
    },
  });
  const revokedGatetwayKeys = [gatewayKey];
  const children = await prismaClient.gatewayKey.findMany({
    where: {
      parentId: gatewayKeyId,
      status: GatewayKeyConst.Status.Active,
    },
  });
  for (const child of children) {
    revokedGatetwayKeys.push(...await revokeGatewayKeyRecursively(prismaClient, child.id));
  }
  return revokedGatetwayKeys;
}
