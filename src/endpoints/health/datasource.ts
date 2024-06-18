import { PrismaClient } from '@/lib/db/client';

export const getDataSourceHealth = async (prismaClient: PrismaClient) => {
  try {
    const prismaClientPingResult = await prismaClient.$queryRaw<[{ check: bigint }]>`SELECT 42 AS check`;
    return Number(prismaClientPingResult?.[0]['check']) === 42;
  } catch {
    return false;
  }
};
