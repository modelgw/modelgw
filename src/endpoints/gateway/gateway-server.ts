import { logger } from "@/lib/logger";
import express from "express";
import requestIp from 'request-ip';
import { createGatewayHandler } from "./handler";

export function createGatewayServer(prismaClient: any, GATEWAY_PORT: number) {

  var app = express();
  app.disable('x-powered-by');
  app.use(requestIp.mw());
  app.use(express.json());
  app.all('/*', createGatewayHandler({ prismaClient }));

  const server = app.listen(GATEWAY_PORT, function () {
    logger.info({ port: GATEWAY_PORT }, 'Gateway listening');
  });

  return server;

}