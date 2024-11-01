import { createOpenAI } from '@ai-sdk/openai';
import { createEdgeRuntimeAPI } from '@assistant-ui/react/edge';
import { Request as ExpressRequest, RequestHandler, Response } from 'express';
import { createOllama } from 'ollama-ai-provider';
import { getUser } from '../../lib/auth';
import { PrismaClient } from '../../lib/db/client';
import { InferenceEndpointConst } from '../../lib/db/const';
import { logger } from '../../lib/logger';
import { decodeGlobalIdStr } from '../graphql/utils';


export type CreateChatHandlerOptions = {
  prismaClient: PrismaClient;
};

export const createChatHandler = ({ prismaClient }: CreateChatHandlerOptions): RequestHandler => {
  return async (req: ExpressRequest, res: Response) => {
    const authorization = req.headers.authorization;
    const token = authorization ? authorization.split(' ')[1] : req.cookies?.token;
    const user = getUser(token) ?? undefined;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    logger.info({ body: req.body, headers: req.headers, url: req.url, query: req.query, path: req.path, originalUrl: req.originalUrl }, 'Chat request received');
    const body = req.body;
    const modelName = body.modelgw.modelName;
    const abortController = new AbortController();
    const inferenceEndpointId = body.modelgw.inferenceEndpointId;
    const inferenceEndpoint = await prismaClient.inferenceEndpoint.findUnique({ where: { id: decodeGlobalIdStr(inferenceEndpointId).id } });
    let runtimeModel;
    if (inferenceEndpoint?.platform === InferenceEndpointConst.Platform.Ollama) {
      const ollama = createOllama({ baseURL: inferenceEndpoint!.endpoint + '/api' });
      runtimeModel = ollama(modelName);
    } else {
      // TODO: other endpoints
      const openai = createOpenAI({
        compatibility: 'strict', // strict mode, enable when using the OpenAI API
        apiKey: inferenceEndpoint!.key!,
      });
      runtimeModel = openai(modelName);
    }

    const { POST } = createEdgeRuntimeAPI({
      model: runtimeModel,
    });

    try {
      const response = await POST(new Request('http://localhost:3000/', {
        method: 'POST',
        signal: abortController.signal,
        body: JSON.stringify(req.body),
      }));

      res.setHeader('Content-Type', response.headers.get('Content-Type')!);
      const writableStream = new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
        abort(err) {
          logger.error('Stream aborted due to error:', err);
          res.end();
        }
      });

      response!.body!.pipeTo(writableStream);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
