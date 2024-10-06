import cron from 'node-cron';
import { prismaClient } from "./db/client";
import { GatewayKeyConst } from "./db/const";
import { logger } from './logger';

// Daily reset at midnight
cron.schedule('0 0 * * *', async () => {
  logger.info('Resetting daily gateway key usage');
  await prismaClient.gatewayKey.updateMany({
    where: { resetFrequency: GatewayKeyConst.ResetFrequency.Daily },
    data: { promptTokens: 0, completionTokens: 0, lastResetAt: new Date() },
  });
});

// Hourly reset at the top of every hour
cron.schedule('0 * * * *', async () => {
  logger.info('Resetting hourly gateway keys usage');
  await prismaClient.gatewayKey.updateMany({
    where: { resetFrequency: GatewayKeyConst.ResetFrequency.Hourly },
    data: { promptTokens: 0, completionTokens: 0, lastResetAt: new Date() },
  });
});
