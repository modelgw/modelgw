-- AlterTable
ALTER TABLE "gateways" ADD COLUMN     "trace_payload" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trace_traffic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "gateway_requests" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "body" TEXT,
    "content_type" TEXT,
    "request_id" TEXT NOT NULL,
    "top_p" DOUBLE PRECISION,
    "tools" BOOLEAN,
    "seed" INTEGER,
    "stream" BOOLEAN,
    "temperature" DOUBLE PRECISION,
    "max_tokens" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gateway_id" TEXT NOT NULL,
    "gateway_key_id" TEXT,

    CONSTRAINT "gateway_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_responses" (
    "id" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "status_code" INTEGER NOT NULL,
    "headers" JSONB NOT NULL,
    "body" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gateway_request_id" TEXT NOT NULL,
    "inference_endpoint_response_id" TEXT,

    CONSTRAINT "gateway_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inference_endpoint_requests" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "body" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gateway_request_id" TEXT NOT NULL,
    "inference_endpoint_id" TEXT NOT NULL,

    CONSTRAINT "inference_endpoint_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inference_endpoint_responses" (
    "id" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "headers" JSONB NOT NULL,
    "body" TEXT,
    "choices" INTEGER,
    "system_fingerprint" TEXT,
    "prompt_tokens" INTEGER,
    "completion_tokens" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inference_endpoint_request_id" TEXT NOT NULL,

    CONSTRAINT "inference_endpoint_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gateway_requests_request_id_idx" ON "gateway_requests"("request_id");

-- CreateIndex
CREATE INDEX "gateway_requests_created_at_idx" ON "gateway_requests"("created_at" DESC);

-- CreateIndex
CREATE INDEX "gateway_requests_gateway_id_idx" ON "gateway_requests"("gateway_id");

-- CreateIndex
CREATE INDEX "gateway_requests_gateway_key_id_idx" ON "gateway_requests"("gateway_key_id");

-- CreateIndex
CREATE UNIQUE INDEX "gateway_responses_gateway_request_id_key" ON "gateway_responses"("gateway_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "gateway_responses_inference_endpoint_response_id_key" ON "gateway_responses"("inference_endpoint_response_id");

-- CreateIndex
CREATE INDEX "gateway_responses_status_code_idx" ON "gateway_responses"("status_code");

-- CreateIndex
CREATE INDEX "gateway_responses_gateway_request_id_idx" ON "gateway_responses"("gateway_request_id");

-- CreateIndex
CREATE INDEX "gateway_responses_inference_endpoint_response_id_idx" ON "gateway_responses"("inference_endpoint_response_id");

-- CreateIndex
CREATE INDEX "inference_endpoint_requests_gateway_request_id_idx" ON "inference_endpoint_requests"("gateway_request_id");

-- CreateIndex
CREATE INDEX "inference_endpoint_requests_inference_endpoint_id_idx" ON "inference_endpoint_requests"("inference_endpoint_id");

-- CreateIndex
CREATE UNIQUE INDEX "inference_endpoint_responses_inference_endpoint_request_id_key" ON "inference_endpoint_responses"("inference_endpoint_request_id");

-- CreateIndex
CREATE INDEX "inference_endpoint_responses_inference_endpoint_request_id_idx" ON "inference_endpoint_responses"("inference_endpoint_request_id");

-- AddForeignKey
ALTER TABLE "gateway_requests" ADD CONSTRAINT "gateway_requests_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "gateways"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_requests" ADD CONSTRAINT "gateway_requests_gateway_key_id_fkey" FOREIGN KEY ("gateway_key_id") REFERENCES "gateway_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_responses" ADD CONSTRAINT "gateway_responses_gateway_request_id_fkey" FOREIGN KEY ("gateway_request_id") REFERENCES "gateway_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_responses" ADD CONSTRAINT "gateway_responses_inference_endpoint_response_id_fkey" FOREIGN KEY ("inference_endpoint_response_id") REFERENCES "inference_endpoint_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inference_endpoint_requests" ADD CONSTRAINT "inference_endpoint_requests_gateway_request_id_fkey" FOREIGN KEY ("gateway_request_id") REFERENCES "gateway_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inference_endpoint_requests" ADD CONSTRAINT "inference_endpoint_requests_inference_endpoint_id_fkey" FOREIGN KEY ("inference_endpoint_id") REFERENCES "inference_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inference_endpoint_responses" ADD CONSTRAINT "inference_endpoint_responses_inference_endpoint_request_id_fkey" FOREIGN KEY ("inference_endpoint_request_id") REFERENCES "inference_endpoint_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
