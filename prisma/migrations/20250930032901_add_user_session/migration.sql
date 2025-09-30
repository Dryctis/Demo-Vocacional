/*
  Warnings:

  - You are about to drop the column `userId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Answer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "UserSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("id", "question", "response", "updatedAt") SELECT "id", "question", "response", "updatedAt" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
