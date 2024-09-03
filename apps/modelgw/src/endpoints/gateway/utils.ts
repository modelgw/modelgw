import { Request } from "express";
import { HeadersInit } from "node-fetch";
import { PrismaClient } from "../../lib/db/client";
import { InferenceEndpointConst } from "../../lib/db/const";


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
