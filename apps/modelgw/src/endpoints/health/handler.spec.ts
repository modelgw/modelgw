import { createMockExpressRequest, createMockExpressResponse } from '../../mocks/express';
import { createMockPrismaClient } from '../../mocks/prisma-client';
import { getDataSourceHealth } from './datasource';
import { createHealthcheckHandler, CreateHealthcheckHandlerOptions, HealthCheckResult } from './handler';

jest.mock('./datasource', () => ({
  getDataSourceHealth: jest.fn(),
}));

const MOCK_GET_DATA_SOURCE_HEALTH = getDataSourceHealth as jest.Mock;

const MOCK_REQUEST = createMockExpressRequest();
const MOCK_RESPONSE = createMockExpressResponse();
const MOCK_NEXT_DELEGATE = jest.fn();

const MOCK_PRISMA_CLIENT = createMockPrismaClient();
const MOCK_CREATE_HEALTHCHECK_HANDLER_OPTIONS: CreateHealthcheckHandlerOptions = {
  prismaClient: MOCK_PRISMA_CLIENT,
};

describe('.healthcheck-handler', () => {
  describe('when called', () => {
    describe.each([
      [
        'data source - not healthy',
        false,
        503,
        { dataSource: false },
      ],
      [
        'data source - healthy',
        true,
        200,
        { dataSource: true },
      ],
    ])(
      'and %s',
      (
        _statement,
        mockResultGetDataSourceHealth,
        expectedStatusCode,
        expectedResponseBody: HealthCheckResult
      ) => {
        beforeAll(async () => {
          MOCK_GET_DATA_SOURCE_HEALTH.mockResolvedValue(mockResultGetDataSourceHealth);

          const handler = createHealthcheckHandler(MOCK_CREATE_HEALTHCHECK_HANDLER_OPTIONS);
          await handler(MOCK_REQUEST, MOCK_RESPONSE, MOCK_NEXT_DELEGATE);
        });

        afterAll(() => {
          MOCK_GET_DATA_SOURCE_HEALTH.mockReset();
          MOCK_RESPONSE.status.mockClear();
          MOCK_RESPONSE.send.mockClear();
        });

        it('sends expected response', () => {
          expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
          expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(expectedStatusCode);
          expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
          expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(expectedResponseBody);
        });
      }
    );
  });
});
