import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '../lib/db/client';

export const createMockPrismaClient = (): DeepMockProxy<PrismaClient> => mockDeep<PrismaClient>();
