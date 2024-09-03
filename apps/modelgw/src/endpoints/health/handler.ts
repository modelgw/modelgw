import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '../../lib/db/client';
import { getDataSourceHealth } from './datasource';


export type HealthCheckResult = {
  dataSource: boolean;
};

export type CreateHealthcheckHandlerOptions = {
  prismaClient: PrismaClient;
};

export const createHealthcheckHandler = (options: CreateHealthcheckHandlerOptions): RequestHandler => {
  return async (req: Request, res: Response) => {
    const result: HealthCheckResult = {
      dataSource: await getDataSourceHealth(options.prismaClient),
    };

    const hasFailedCheck = Object.values(result).includes(false);
    const statusCode = hasFailedCheck ? 503 : 200;

    res.status(statusCode).send(result);
  };
};
