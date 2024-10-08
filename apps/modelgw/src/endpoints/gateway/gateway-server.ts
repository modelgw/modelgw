import express, { NextFunction, Request, Response } from 'express';
import requestIp from 'request-ip';
import { logger } from '../../lib/logger';
import { createGatewayHandler } from './handler';

declare module 'http' {
  interface IncomingMessage {
    rawBody: string;
  }
}

function asyncErrorBoundary(func: (req: Request, res: Response, next: NextFunction) => void) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await func(req, res, next);
    }
    catch (err) {
      next(err);
    }
  }
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error({ err, url: req.url, method: req.method }, 'Error in gateway endpoint');
  res.status(500).json({ error: 'Internal server error' });
}

export function createGatewayServer(prismaClient: any, GATEWAY_PORT: number) {

  var app = express();
  app.disable('x-powered-by');
  app.use(requestIp.mw());
  app.use(express.json({
    verify(req, _res, buf, _encoding) {
      req.rawBody = buf.toString();
    },
  }));
  app.all('/*', asyncErrorBoundary(createGatewayHandler({ prismaClient })));
  app.use(errorHandler);

  const server = app.listen(GATEWAY_PORT, function () {
    logger.info({ port: GATEWAY_PORT }, 'Gateway listening');
  });

  return server;

}