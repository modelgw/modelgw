import { PrismaClient } from '@/lib/db/client';
import { GatewayKeyConst, InferenceEndpointConst } from '@/lib/db/const';
import { logger as mainLogger } from "@/lib/logger";
import { createId } from '@paralleldrive/cuid2';
import { Gateway, InferenceEndpoint } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { createHash } from "crypto";
import { Request, RequestHandler, Response } from 'express';
import lodash from 'lodash';
import pino from 'pino';
import { GatewayExhaustedResponse, GatewayExhaustedResponseStatus, OpenAIUnauthorizedResponse, OpenAIUnauthorizedResponseStatus } from './response';
import { StreamCollectTransform } from './StreamCollectTransform';
import { createHeadersFromRequest, resetThrottlingEndpoints, setEndpointStatus, shuffleArray } from './utils';

export type GatewayResult = {
  dataSource: boolean;
};

export type CreateGatewayHandlerOptions = {
  prismaClient: PrismaClient;
};

export const createGatewayHandler = ({ prismaClient }: CreateGatewayHandlerOptions): RequestHandler => {
  return async (req: Request, res: Response) => {
    //@ts-ignore
    const clientIp = req.clientIp;
    const requestId = createId();
    const logger = mainLogger.child({ clientIp, requestId });
    logger.info({ url: req.url, method: req.method }, 'Gateway endpoint received request');
    let key: string | null | undefined = req.headers['authorization']?.replace(/^Bearer\s+/, '');
    if (!key) {
      key = Array.isArray(req.headers['api-key']) ? req.headers['api-key'][0] : req.headers['api-key'];
    };
    if (!key) return res.status(OpenAIUnauthorizedResponseStatus).json(OpenAIUnauthorizedResponse);

    const keyHash = createHash('sha256').update(key).digest('hex');
    const gatewayKey = await prismaClient.gatewayKey.findFirst({
      where: {
        keyHash,
        status: GatewayKeyConst.Status.Active,
      },
    });
    if (!gatewayKey) return res.status(OpenAIUnauthorizedResponseStatus).json(OpenAIUnauthorizedResponse);

    await resetThrottlingEndpoints(prismaClient);

    const gateway = await prismaClient.gateway.findUniqueOrThrow({
      where: { id: gatewayKey.gatewayId },
      include: {
        inferenceEndpoints: {
          include: {
            inferenceEndpoint: true,
          },
          where: {
            inferenceEndpoint: {
              status: InferenceEndpointConst.Status.Active,
            },
          },
        }
      }
    });
    if (gateway.logTraffic) {
      logger.info({
        gateway: { id: gateway.id },
        url: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          authorization: req.headers['authorization'] ? '[REDACTED]' : undefined,
          'api-key': req.headers['api-key'] ? '[REDACTED]' : undefined,
        },
        body: gateway.logPayload ? req.body : undefined,
      }, 'Gateway request received');
    }

    let inferenceEndpoints = gateway.inferenceEndpoints.map(value => value.inferenceEndpoint);
    shuffleArray(inferenceEndpoints);

    for (const endpoint of inferenceEndpoints) {
      const processed = await requestEndpoint({ prismaClient, req, res, gateway, endpoint, logger });
      if (processed) return;
    }
    res.status(GatewayExhaustedResponseStatus).json(GatewayExhaustedResponse);
  };
};

type RequestAzureOpenAIOptions = {
  prismaClient: PrismaClient;
  req: Request;
  res: Response;
  gateway: Gateway;
  endpoint: InferenceEndpoint;
  logger: pino.Logger;
};
export async function requestEndpoint({ req, res, gateway, endpoint, prismaClient, logger: mainLogger }: RequestAzureOpenAIOptions) {
  const logger = mainLogger.child({ inferenceEndpoint: { id: endpoint.id } });
  const headers = createHeadersFromRequest(req);
  const body = req.is('json') ? { ...req.body } : req.body; //shallow copy
  let url = new URL(req.url, endpoint.endpoint).toString();
  if (endpoint.platform === InferenceEndpointConst.Platform.AzureOpenAI) {
    headers['api-key'] = endpoint.key!;
    if (body.model === 'auto') {
      body.model = endpoint.deploymentName;
    }
    url = url.replace('/auto/', `/${endpoint.deploymentName}/`);
  } else if (endpoint.key) {
    headers['authorization'] = `Bearer ${endpoint.key}`;
  }

  if (gateway.logTraffic) {
    logger.debug({
      url,
      body: gateway.logPayload ? body : undefined,
      method: req.method,
    }, 'Sending request to inference endpoint');
  }
  const startTime = performance.now();
  try {
    var fetchResponse = await axios({
      url: url,
      method: req.method,
      headers,
      responseType: 'stream',
      data: req.method == 'GET' || lodash.isEmpty(body) ? undefined : body,
    });
  } catch (error: unknown | AxiosError) {
    const endTime = performance.now();
    if (axios.isAxiosError(error)) {
      logger.error({
        error: error.code,
        status: error.status,
        headers: error.response?.headers,
        duration: (endTime - startTime) / 1000,
      }, 'Inference endpoint request failed with axios error');
      // Access to config, request, and response
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        const retryAfterSec = error.response.headers['retry-after'] ? parseInt(error.response.headers['retry-after']) : undefined;
        if (error.response.status == 429) {
          await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Throttling, retryAfterSec, null, prismaClient);
        } else if (error.response.status == 401 || error.response.status == 403) {
          await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, retryAfterSec, error.response.statusText, prismaClient);
        }
      } else if (error.request) {
        // The request was made but no response was received
        await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, 30, error.message, prismaClient);
      } else {
        // Something happened in setting up the request that triggered an Error
        await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, 30, error.message, prismaClient);
      }
    } else {
      logger.error({
        error: error,
        duration: (endTime - startTime) / 1000,
      }, 'Inference endpoint request failed');
      await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, 30, String(error), prismaClient);
    }
    return false;
  }
  // got 2xx response
  if (gateway.logTraffic) {
    logger.info({
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      duration: (performance.now() - startTime) / 1000,
    }, 'Inference endpoint request successful. Starting to stream response');
  }
  const gatewayResponseHeaders = { ...fetchResponse.headers, 'x-modelgw-inference-endpoint-id': endpoint.id.toString() };
  res.header(gatewayResponseHeaders);

  const transform = new StreamCollectTransform();
  transform.on('close', () => {
    if (gateway.logTraffic) {
      logger.info({
        status: fetchResponse.status,
        headers: gatewayResponseHeaders,
        duration: (performance.now() - startTime) / 1000,
        body: gateway.logPayload ? transform.content : undefined,
        firstTokenTime: transform.firstTokenTime ? (transform.firstTokenTime - startTime) / 1000 : undefined,
      }, 'Inference endpoint request completed');
    }
  });
  fetchResponse.data.pipe(transform).pipe(res);

  return true;
}
