import { createMockExpressRequest, createMockExpressResponse } from '@/mocks/express';
import { createMockPrismaClient } from '@/mocks/prisma-client';
import { ExpressContextFunctionArgument, ExpressMiddlewareOptions } from '@apollo/server/express4';
import { WithRequired } from '@apollo/utils.withrequired';
import jwt from 'jsonwebtoken';
import { createServerContextMiddlewareOptionsAsync, ServerContext } from './server-context';

const MOCK_INSTANCE_PRISMA_CLIENT = createMockPrismaClient();

describe('.createServerContextMiddlewareOptionsAsync', () => {
	describe('when called without token', () => {
		let result: WithRequired<ExpressMiddlewareOptions<ServerContext>, 'context'>;

		beforeAll(async () => {
			result = await createServerContextMiddlewareOptionsAsync(MOCK_INSTANCE_PRISMA_CLIENT);
		});

		it('expected structure', () => {
			expect(result).toBeDefined();
			expect(result.context).toBeInstanceOf(Function);
		});

		describe('#context', () => {
			let contextResult: ServerContext;

			const MOCK_CONTEXT_FUNCTION_ARGS: ExpressContextFunctionArgument = {
				req: createMockExpressRequest(),
				res: createMockExpressResponse(),
			};
			beforeAll(async () => {
				contextResult = await result.context(MOCK_CONTEXT_FUNCTION_ARGS);
			});

			it('returns expected result', async () => {
				expect(contextResult.logger).toBeDefined();
				expect(contextResult.req).toBe(MOCK_CONTEXT_FUNCTION_ARGS.req);
				expect(contextResult.res).toBe(MOCK_CONTEXT_FUNCTION_ARGS.res);
				expect(contextResult.prismaClient).toBe(MOCK_INSTANCE_PRISMA_CLIENT);
				expect(contextResult.user).toBeUndefined();
			});
		});
	});

	describe('when called with invalid token', () => {
		let result: WithRequired<ExpressMiddlewareOptions<ServerContext>, 'context'>;

		beforeAll(async () => {
			result = await createServerContextMiddlewareOptionsAsync(MOCK_INSTANCE_PRISMA_CLIENT);
		});

		it('expected structure', () => {
			expect(result).toBeDefined();
			expect(result.context).toBeInstanceOf(Function);
		});

		describe('#context', () => {
			let contextResult: ServerContext;

			const MOCK_CONTEXT_FUNCTION_ARGS: ExpressContextFunctionArgument = {
				req: createMockExpressRequest(),
				res: createMockExpressResponse(),
			};
			MOCK_CONTEXT_FUNCTION_ARGS.req.headers.authorization = 'Bearer INVALID_TOKEN';
			beforeAll(async () => {
				contextResult = await result.context(MOCK_CONTEXT_FUNCTION_ARGS);
			});

			it('returns expected result', async () => {
				expect(contextResult.logger).toBeDefined();
				expect(contextResult.req).toBe(MOCK_CONTEXT_FUNCTION_ARGS.req);
				expect(contextResult.res).toBe(MOCK_CONTEXT_FUNCTION_ARGS.res);
				expect(contextResult.prismaClient).toBe(MOCK_INSTANCE_PRISMA_CLIENT);
				expect(contextResult.user).toBeUndefined();
			});
		});
	});


	describe('when called with valid token', () => {
		const OLD_ENV = process.env;
		let result: WithRequired<ExpressMiddlewareOptions<ServerContext>, 'context'>;

		beforeAll(async () => {
			result = await createServerContextMiddlewareOptionsAsync(MOCK_INSTANCE_PRISMA_CLIENT);
			jest.resetModules();
			process.env = { ...OLD_ENV, JWT_SECRET: 'TEST_JWT_SECRET' };
		});
		afterAll(() => {
			process.env = OLD_ENV;
		});

		it('expected structure', () => {
			expect(result).toBeDefined();
			expect(result.context).toBeInstanceOf(Function);
		});

		describe('#context', () => {
			let contextResult: ServerContext;

			const MOCK_CONTEXT_FUNCTION_ARGS: ExpressContextFunctionArgument = {
				req: createMockExpressRequest(),
				res: createMockExpressResponse(),
			};
			const TOKEN = jwt.sign({ sub: 'TEST', email: 'TEST@TEST' }, 'TEST_JWT_SECRET', {
				expiresIn: '24h',
			});
			MOCK_CONTEXT_FUNCTION_ARGS.req.headers.authorization = 'Bearer ' + TOKEN;
			beforeAll(async () => {
				contextResult = await result.context(MOCK_CONTEXT_FUNCTION_ARGS);
			});

			it('returns expected result', async () => {
				expect(contextResult.logger).toBeDefined();
				expect(contextResult.req).toBe(MOCK_CONTEXT_FUNCTION_ARGS.req);
				expect(contextResult.res).toBe(MOCK_CONTEXT_FUNCTION_ARGS.res);
				expect(contextResult.prismaClient).toBe(MOCK_INSTANCE_PRISMA_CLIENT);
				expect(contextResult.user).toMatchObject({
					id: 'ADMIN',
					email: 'TEST@TEST',
					name: 'ADMIN',
					lastName: 'ADMIN',
				});
			});
		});
	});
});
