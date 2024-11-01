import fs from 'node:fs';

function hasDockerEnv() {
  try {
    fs.statSync('/.dockerenv');
    return true;
  } catch {
    return false;
  }
}

function hasDockerCGroup() {
  try {
    return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
  } catch {
    return false;
  }
}

export default function isDocker() {
  return hasDockerEnv() || hasDockerCGroup();
}


if (isDocker()) {
  require('module-alias/register');
}

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { createChatHandler } from './endpoints/chat';
import { createGatewayServer } from './endpoints/gateway/gateway-server';
import { createGraphqlServerMiddlewareAsync, graphqlServer } from './endpoints/graphql/graphql-server';
import { createHealthcheckHandler } from './endpoints/health';
import { prismaClient } from './lib/db/client';
import './lib/scheduler';

const ADMIN_PORT = parseInt(process.env.ADMIN_PORT ?? '4000');
const GATEWAY_PORT = parseInt(process.env.GATEWAY_PORT ?? '4001');

let CORS_ALLOWED_ORIGINS: string[] | undefined;
if (process.env.CORS_ALLOWED_ORIGINS && process.env.CORS_ALLOWED_ORIGINS !== '*') {
  CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS.split(',');
}

(async () => {
  // Required logic for integrating with Express
  const app = express();

  // Set up common Express middleware
  app.use(
    cors<cors.CorsRequest>({
      origin: CORS_ALLOWED_ORIGINS
        ? new RegExp(CORS_ALLOWED_ORIGINS.filter(Boolean).join('|'))
        : '*',
      credentials: true,
    }),
    cookieParser(),
    bodyParser.json()
  );

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // GraphQL server initialization
  graphqlServer.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer }));
  await graphqlServer.start();

  // Set up server-related Express middleware
  app.use('/graphql', await createGraphqlServerMiddlewareAsync(prismaClient));
  app.use('/chat', createChatHandler({ prismaClient }));
  app.use('/health', createHealthcheckHandler({ prismaClient }));

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: ADMIN_PORT }, resolve));
  console.log('\x1b[33m 🚀 Server ready. Endpoints: \x1b[0m');
  console.table({
    GraphQL: { Method: 'GET', Endpoint: `http://localhost:${ADMIN_PORT}/graphql` },
    Chat: { Method: 'POST', Endpoint: `http://localhost:${ADMIN_PORT}/chat` },
    HealthCheck: { Method: 'GET', Endpoint: `http://localhost:${ADMIN_PORT}/health` },
  });

  const gwHttpServer = createGatewayServer(prismaClient, GATEWAY_PORT);

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
      console.log('Admin API HTTP server closed');
    });
    gwHttpServer.close(() => {
      console.log('Gateway HTTP server closed');
    });
  });

})();
