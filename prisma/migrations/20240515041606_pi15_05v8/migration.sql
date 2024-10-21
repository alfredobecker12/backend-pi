/*
  Warnings:

  - Added the required column `quantidade` to the `PedidoProduto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PedidoProduto" ADD COLUMN     "quantidade" INTEGER NOT NULL;
