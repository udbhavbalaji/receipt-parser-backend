-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "flags" TEXT,
    "qty" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    CONSTRAINT "Item_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("receiptId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("amount", "description", "flags", "id", "itemId", "qty", "receiptId", "unitPrice") SELECT "amount", "description", "flags", "id", "itemId", "qty", "receiptId", "unitPrice" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_itemId_key" ON "Item"("itemId");
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
    CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("currency", "date", "id", "merchantAddress", "merchantName", "merchantPhone", "merchantWebsite", "receiptId", "receiptNo", "serviceCharge", "subtotal", "tax", "time", "tip", "total", "userId") SELECT "currency", "date", "id", "merchantAddress", "merchantName", "merchantPhone", "merchantWebsite", "receiptId", "receiptNo", "serviceCharge", "subtotal", "tax", "time", "tip", "total", "userId" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
CREATE UNIQUE INDEX "Receipt_receiptId_key" ON "Receipt"("receiptId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
