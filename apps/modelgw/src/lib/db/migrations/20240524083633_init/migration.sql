-- CreateTable
CREATE TABLE "inference_endpoints" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "region" TEXT,
    "endpoint" TEXT NOT NULL,
    "key" TEXT,
    "model_name" TEXT,
    "model_version" TEXT,
    "deployment_name" TEXT,
    "status" TEXT NOT NULL,
    "retry_after" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inference_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_inference_endpoints" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "inference_endpoint_id" TEXT NOT NULL,
    "gateway_id" TEXT NOT NULL,

    CONSTRAINT "gateway_inference_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateways" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "masked_key" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "gateway_id" TEXT NOT NULL,

    CONSTRAINT "gateway_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inference_endpoints_status_idx" ON "inference_endpoints" USING HASH ("status");

-- CreateIndex
CREATE UNIQUE INDEX "gateway_keys_key_hash_key" ON "gateway_keys"("key_hash");

-- CreateIndex
CREATE INDEX "gateway_keys_key_hash_idx" ON "gateway_keys"("key_hash");

-- CreateIndex
CREATE INDEX "gateway_keys_status_idx" ON "gateway_keys"("status");

-- CreateIndex
CREATE INDEX "gateway_keys_gateway_id_idx" ON "gateway_keys"("gateway_id");

-- AddForeignKey
ALTER TABLE "gateway_inference_endpoints" ADD CONSTRAINT "gateway_inference_endpoints_inference_endpoint_id_fkey" FOREIGN KEY ("inference_endpoint_id") REFERENCES "inference_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_inference_endpoints" ADD CONSTRAINT "gateway_inference_endpoints_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "gateways"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_keys" ADD CONSTRAINT "gateway_keys_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "gateways"("id") ON DELETE CASCADE ON UPDATE CASCADE;
