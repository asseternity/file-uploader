/*
  Warnings:

  - Added the required column `filesize` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "filesize" TEXT NOT NULL;
