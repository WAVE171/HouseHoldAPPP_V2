/*
  Warnings:

  - You are about to drop the column `superAdminEmail` on the `impersonation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `targetUserEmail` on the `impersonation_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "impersonation_logs" DROP COLUMN "superAdminEmail",
DROP COLUMN "targetUserEmail";

-- AddForeignKey
ALTER TABLE "impersonation_logs" ADD CONSTRAINT "impersonation_logs_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_logs" ADD CONSTRAINT "impersonation_logs_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
