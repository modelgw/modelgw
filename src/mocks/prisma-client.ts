import { PrismaClient } from '@/lib/db/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

export const createMockPrismaClient = (): DeepMockProxy<PrismaClient> => mockDeep<PrismaClient>();
