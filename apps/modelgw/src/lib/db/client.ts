import { PrismaClient as GeneratedPrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';


export const prismaClient = new GeneratedPrismaClient().$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  })
);
// need to re-export the type to avoid compatibility issues with the generated PrismaClient
export type PrismaClient = typeof prismaClient;
