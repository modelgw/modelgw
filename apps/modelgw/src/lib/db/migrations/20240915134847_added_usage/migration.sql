-- AlterTable
ALTER TABLE "gateway_keys" ADD COLUMN     "completion_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completion_tokens_limit" INTEGER,
ADD COLUMN     "last_reset_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "prompt_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prompt_tokens_limit" INTEGER,
ADD COLUMN     "reset_frequency" TEXT;

-- CreateTable
CREATE TABLE "gateway_key_usage_history" (
    "id" SERIAL NOT NULL,
    "gateway_key_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,

    CONSTRAINT "gateway_key_usage_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gateway_key_usage_history_gateway_key_id_idx" ON "gateway_key_usage_history"("gateway_key_id");

-- CreateIndex
CREATE INDEX "gateway_key_usage_history_date_idx" ON "gateway_key_usage_history"("date");

-- AddForeignKey
ALTER TABLE "gateway_keys" ADD CONSTRAINT "gateway_keys_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "gateway_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_key_usage_history" ADD CONSTRAINT "gateway_key_usage_history_gateway_key_id_fkey" FOREIGN KEY ("gateway_key_id") REFERENCES "gateway_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
