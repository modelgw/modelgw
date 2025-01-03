import { BaseContext } from '@apollo/server';
import { ExpressContextFunctionArgument, ExpressMiddlewareOptions } from '@apollo/server/express4';
import { WithRequired } from '@apollo/utils.withrequired';
import { createId } from '@paralleldrive/cuid2';
import pino from 'pino';
import { getUser, User } from '../../lib/auth';
import { PrismaClient } from '../../lib/db/client';
import { logger as mainLogger } from '../../lib/logger';


export type ServerContext = BaseContext & ExpressContextFunctionArgument & {
  logger: pino.Logger;
  prismaClient: PrismaClient;
  user?: User;
};

export const createServerContextMiddlewareOptionsAsync = async (prismaClient: PrismaClient): Promise<
  WithRequired<ExpressMiddlewareOptions<ServerContext>, 'context'>
> => {
  return {
    context: async (ctx: ExpressContextFunctionArgument): Promise<ServerContext> => {
      const authorization = ctx.req.headers.authorization;
      const token = authorization ? authorization.split(' ')[1] : ctx.req.cookies?.token;
      const user = getUser(token) ?? undefined;

      const clientIp = ctx.req.clientIp;
      const requestId = createId();
      const logger = mainLogger.child({ clientIp, requestId, user: user ? { id: user?.id } : undefined });

      return {
        logger,
        prismaClient,
        req: ctx.req,
        res: ctx.res,
        user,
      };
    },
  };
};
export { User };

