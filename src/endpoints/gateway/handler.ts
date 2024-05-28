import { PrismaClient } from '@/lib/db/client';
import { GatewayKeyConst, InferenceEndpointConst } from '@/lib/db/const';
import { logger as mainLogger } from "@/lib/logger";
import { createId } from '@paralleldrive/cuid2';
import { InferenceEndpoint } from '@prisma/client';
import axios from 'axios';
import { createHash } from "crypto";
import { Request, RequestHandler, Response } from 'express';
import pino from 'pino';
import { GatewayExhaustedResponse, GatewayExhaustedResponseStatus, OpenAIUnauthorizedResponse, OpenAIUnauthorizedResponseStatus } from './response';
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
		logger.info({ clientIp, url: req.url, method: req.method }, 'Received gateway request');
		let key: string | null | undefined = req.headers['authorization']?.replace(/^Bearer\s+/, '');
		if (!key) {
			key = req.headers['api-key']?.at(0);
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

		let inferenceEndpoints = gateway.inferenceEndpoints.map(value => value.inferenceEndpoint);
		logger.info({ inferenceEndpoints }, 'Inference endpoints');
		shuffleArray(inferenceEndpoints);
		logger.info({ inferenceEndpoints }, 'Shuffled inference endpoints');

		for (const endpoint of inferenceEndpoints) {
			const processed = await requestEndpoint({ prismaClient, req, res, endpoint, logger });
			if (processed) return;
		}
		res.status(GatewayExhaustedResponseStatus).json(GatewayExhaustedResponse);
	};
};

type RequestAzureOpenAIOptions = {
	prismaClient: PrismaClient;
	req: Request;
	res: Response;
	endpoint: InferenceEndpoint;
	logger: pino.Logger;
};
export async function requestEndpoint({ req, res, endpoint, prismaClient, logger }: RequestAzureOpenAIOptions) {
	const headers = createHeadersFromRequest(req);
	const body = { ...req.body }; //shallow copy
	let url = new URL(req.url, endpoint.endpoint).toString();
	if (endpoint.platform === InferenceEndpointConst.Platform.AzureOpenAI) {
		headers['api-key'] = endpoint.key!;
		if (body.model === 'auto') body.model = endpoint.deploymentName;
		url = url.replace('/auto/', `/${endpoint.deploymentName}/`);
	}

	logger.debug({ url, body, endpoint: { id: endpoint.id } }, 'Requesting endpoint');
	const startTime = performance.now();
	try {
		var fetchResponse = await axios({
			url: url,
			method: req.method,
			headers,
			responseType: 'stream',
			data: body,
		});
	} catch (error) {
		logger.error({ error }, 'Azure OpenAI request failed');
		await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, 30, 'Unavailable', prismaClient);
		return false;
	}
	const endTime = performance.now();
	logger.info({ headers: fetchResponse.headers, body, duration: endTime - startTime }, 'Azure OpenAI request completed');
	if (fetchResponse.status == 200) {
		res.header({ ...fetchResponse.headers, 'x-gateway-endpoint-id': endpoint.id.toString() });
		fetchResponse.data.pipe(res);
		// fetchResponse.body!.pipe(res);
		return true;
	} else if (fetchResponse.status == 429) {
		const retryAfterSec = parseInt(fetchResponse.headers['retry-after'] ?? '10');
		await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Throttling, retryAfterSec, null, prismaClient);
	} else if (fetchResponse.status == 401) {
		await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, null, 'Unauthorized', prismaClient);
	} else if (fetchResponse.status == 403) {
		await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, null, 'Forbidden', prismaClient);
	}
	await setEndpointStatus(endpoint.id, InferenceEndpointConst.Status.Error, 30, 'Unavailable', prismaClient);
	return false;
}
