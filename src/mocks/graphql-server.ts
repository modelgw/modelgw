import { ExpressMiddlewareOptions } from '@apollo/server/express4';
import { WithRequired } from '@apollo/utils.withrequired';
import { mock, MockProxy } from 'jest-mock-extended';
import pino from 'pino';
import { ServerContext } from '../endpoints/graphql/server-context';
import { createMockExpressRequest, createMockExpressResponse } from './express';
import { createMockPrismaClient } from './prisma-client';

export const createMockExpressMiddlewareOptions = (): MockProxy<
	WithRequired<ExpressMiddlewareOptions<ServerContext>, 'context'>
> => mock<WithRequired<ExpressMiddlewareOptions<ServerContext>, 'context'>>();

export const createMockDefaultContext = (): ServerContext => ({
	logger: mock<pino.Logger>(),
	prismaClient: createMockPrismaClient(),
	req: createMockExpressRequest(),
	res: createMockExpressResponse(),
});

// type ExecuteOperationParams = Parameters<typeof graphqlServer.executeOperation>;
// type ExecuteOperationReturn = ReturnType<typeof graphqlServer.executeOperation>;
// export const testServerExecuteOperation = async <T>(...params: ExecuteOperationParams, context: ServerContext): ExecuteOperationReturn => {
// 	const executeOperationOptions: ExecuteOperationParams[1] = {
// 		contextValue: createMockDefaultContext(),
// 	};
// 	return await graphqlServer.executeOperation<T>(...params);
// }
