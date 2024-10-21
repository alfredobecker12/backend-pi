/*
  Warnings:

  - Added the required column `receita_bruta` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria_cliente` to the `Representante` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CatCliente" AS ENUM ('P', 'M', 'G');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "receita_bruta" DOUBLE PRECISION NOT NULL default 0;

-- AlterTable
ALTER TABLE "Representante" ADD COLUMN     "categoria_cliente" "CatCliente" NOT NULL;

-- CreateTable
CREATE TABLE "RepresentanteMarca" (
    "cnpjRepresentante" TEXT NOT NULL,
    "idMarca" INTEGER NOT NULL,

    CONSTRAINT "RepresentanteMarca_pkey" PRIMARY KEY ("cnpjRepresentante","idMarca")
);

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_cnpjRepresentante_fkey" FOREIGN KEY ("cnpjRepresentante") REFERENCES "Representante"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_idMarca_fkey" FOREIGN KEY ("idMarca") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
