/*
  Warnings:

  - The primary key for the `Marca` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_cnpj_marca_fkey";

-- DropForeignKey
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_cnpjMarca_fkey";

-- AlterTable
ALTER TABLE "Marca" DROP CONSTRAINT "Marca_pkey",
ALTER COLUMN "cnpj" SET DATA TYPE TEXT,
ADD CONSTRAINT "Marca_pkey" PRIMARY KEY ("cnpj");

-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "cnpj_marca" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RepresentanteMarca" ALTER COLUMN "cnpjMarca" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_cnpjMarca_fkey" FOREIGN KEY ("cnpjMarca") REFERENCES "Marca"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_cnpj_marca_fkey" FOREIGN KEY ("cnpj_marca") REFERENCES "Marca"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
