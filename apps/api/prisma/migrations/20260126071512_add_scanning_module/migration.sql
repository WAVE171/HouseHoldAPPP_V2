-- CreateTable
CREATE TABLE "scanned_receipts" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "storeName" TEXT NOT NULL,
    "storeAddress" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "rawText" TEXT,
    "confidence" DOUBLE PRECISION,
    "ocrService" TEXT,
    "linkedTransactionId" TEXT,
    "householdId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scanned_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scanned_receipt_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "matchedInventoryId" TEXT,
    "confidence" DOUBLE PRECISION,
    "receiptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scanned_receipt_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barcode_products" (
    "id" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "imageUrl" TEXT,
    "defaultPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scanned_receipts_householdId_idx" ON "scanned_receipts"("householdId");

-- CreateIndex
CREATE INDEX "scanned_receipts_date_idx" ON "scanned_receipts"("date");

-- CreateIndex
CREATE INDEX "scanned_receipt_items_receiptId_idx" ON "scanned_receipt_items"("receiptId");

-- CreateIndex
CREATE UNIQUE INDEX "barcode_products_barcode_key" ON "barcode_products"("barcode");

-- CreateIndex
CREATE INDEX "barcode_products_barcode_idx" ON "barcode_products"("barcode");

-- AddForeignKey
ALTER TABLE "scanned_receipt_items" ADD CONSTRAINT "scanned_receipt_items_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "scanned_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
