-- AlterTable
ALTER TABLE "gateways" ADD COLUMN     "log_payload" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "log_traffic" BOOLEAN NOT NULL DEFAULT false;
