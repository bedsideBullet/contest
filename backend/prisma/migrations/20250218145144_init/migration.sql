-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "vehicleModel" TEXT,
    "otherNotes" TEXT,
    "city" TEXT,
    "state" TEXT,
    "phone" TEXT,
    "year" TEXT,
    "make" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("city", "createdAt", "email", "firstName", "id", "lastName", "make", "otherNotes", "phone", "state", "updatedAt", "vehicleModel", "year") SELECT "city", "createdAt", "email", "firstName", "id", "lastName", "make", "otherNotes", "phone", "state", "updatedAt", "vehicleModel", "year" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
