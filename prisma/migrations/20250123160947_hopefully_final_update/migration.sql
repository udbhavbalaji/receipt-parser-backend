/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `Expense` table. All the data in the column will be lost.
  - The primary key for the `SubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SubCategory` table. All the data in the column will be lost.
  - Added the required column `categoryName` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryName` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryName` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Merchant" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    CONSTRAINT "Merchant_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Merchant_subCategoryName_fkey" FOREIGN KEY ("subCategoryName") REFERENCES "SubCategory" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "name" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Category" ("name") SELECT "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "total" REAL NOT NULL,
    CONSTRAINT "Expense_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_subCategoryName_fkey" FOREIGN KEY ("subCategoryName") REFERENCES "SubCategory" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("receiptId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_merchantName_fkey" FOREIGN KEY ("merchantName") REFERENCES "Merchant" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("currency", "date", "id", "merchantName", "receiptId", "total", "userId") SELECT "currency", "date", "id", "merchantName", "receiptId", "total", "userId" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE UNIQUE INDEX "Expense_receiptId_key" ON "Expense"("receiptId");
CREATE TABLE "new_SubCategory" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    CONSTRAINT "SubCategory_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SubCategory" ("name") SELECT "name" FROM "SubCategory";
DROP TABLE "SubCategory";
ALTER TABLE "new_SubCategory" RENAME TO "SubCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
