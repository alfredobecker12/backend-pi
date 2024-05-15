/*
  Warnings:

  - Added the required column `categoria_cliente` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "categoria_cliente" "CatCliente" NOT NULL;
