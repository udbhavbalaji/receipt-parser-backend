/*
  Warnings:

  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("name") SELECT "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Merchant" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    CONSTRAINT "Merchant_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Merchant_subCategoryName_fkey" FOREIGN KEY ("subCategoryName") REFERENCES "SubCategory" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Merchant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Merchant" ("categoryName", "name", "subCategoryName") SELECT "categoryName", "name", "subCategoryName" FROM "Merchant";
DROP TABLE "Merchant";
ALTER TABLE "new_Merchant" RENAME TO "Merchant";
CREATE TABLE "new_SubCategory" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SubCategory_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SubCategory" ("categoryName", "name") SELECT "categoryName", "name" FROM "SubCategory";
DROP TABLE "SubCategory";
ALTER TABLE "new_SubCategory" RENAME TO "SubCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
