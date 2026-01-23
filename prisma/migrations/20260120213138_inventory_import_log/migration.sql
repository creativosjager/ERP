-- CreateTable
CREATE TABLE "InventoryImportLog" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "sheetName" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "updated" INTEGER NOT NULL,
    "skipped" INTEGER NOT NULL,
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryImportLog_pkey" PRIMARY KEY ("id")
);
