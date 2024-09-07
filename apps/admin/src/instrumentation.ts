import { logger } from './lib/logger';

export async function register() {
  logger.info({
    NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
  }, 'Starting Model Gateway Admin');
}
