-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Merchant" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    CONSTRAINT "Merchant_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Merchant_subCategoryName_fkey" FOREIGN KEY ("subCategoryName") REFERENCES "SubCategory" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Merchant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Merchant" ("categoryName", "name", "subCategoryName", "userId") SELECT "categoryName", "name", "subCategoryName", "userId" FROM "Merchant";
DROP TABLE "Merchant";
ALTER TABLE "new_Merchant" RENAME TO "Merchant";
CREATE TABLE "new_SubCategory" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SubCategory_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubCategory" ("categoryName", "name", "userId") SELECT "categoryName", "name", "userId" FROM "SubCategory";
DROP TABLE "SubCategory";
ALTER TABLE "new_SubCategory" RENAME TO "SubCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
