import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import pino from 'pino';

export const createMockLogger = (): DeepMockProxy<pino.Logger> => mockDeep<pino.Logger>();
