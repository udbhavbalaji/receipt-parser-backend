-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "receiptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "merchantAddress" TEXT,
    "merchantPhone" TEXT,
    "merchantWebsite" TEXT,
    "receiptNo" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "total" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "tax" REAL,
    "serviceCharge" TEXT,
    "tip" REAL,
    CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("currency", "date", "id", "merchantAddress", "merchantName", "merchantPhone", "merchantWebsite", "receiptId", "receiptNo", "serviceCharge", "subtotal", "tax", "time", "tip", "total", "userId") SELECT "currency", "date", "id", "merchantAddress", "merchantName", "merchantPhone", "merchantWebsite", "receiptId", "receiptNo", "serviceCharge", "subtotal", "tax", "time", "tip", "total", "userId" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
CREATE UNIQUE INDEX "Receipt_receiptId_key" ON "Receipt"("receiptId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
