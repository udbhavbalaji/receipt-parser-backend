-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "loggedIn" TEXT NOT NULL DEFAULT 'LOGGED_OUT',
    "lastGeneratedToken" TEXT
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "receiptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "merchantAddress" TEXT NOT NULL,
    "merchantPhone" TEXT NOT NULL,
    "merchantWebsite" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "flags" TEXT,
    "qty" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    CONSTRAINT "Item_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("receiptId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptId_key" ON "Receipt"("receiptId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_itemId_key" ON "Item"("itemId");
