/*
  Warnings:

  - The primary key for the `Marca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cnpj` on the `Marca` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj_marca` on the `Produto` table. All the data in the column will be lost.
  - The primary key for the `RepresentanteMarca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cnpj_marca` on the `RepresentanteMarca` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj_representante` on the `RepresentanteMarca` table. All the data in the column will be lost.
  - Added the required column `id_marca` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpjRepresentante` to the `RepresentanteMarca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idMarca` to the `RepresentanteMarca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_cnpj_marca_fkey";

-- DropForeignKey
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_cnpj_marca_fkey";

-- DropForeignKey
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_cnpj_representante_fkey";

-- AlterTable
ALTER TABLE "Marca" DROP CONSTRAINT "Marca_pkey",
DROP COLUMN "cnpj",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Marca_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "cnpj_marca",
ADD COLUMN     "id_marca" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_pkey",
DROP COLUMN "cnpj_marca",
DROP COLUMN "cnpj_representante",
ADD COLUMN     "cnpjRepresentante" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "idMarca" INTEGER NOT NULL,
ADD CONSTRAINT "RepresentanteMarca_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_cnpjRepresentante_fkey" FOREIGN KEY ("cnpjRepresentante") REFERENCES "Representante"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_idMarca_fkey" FOREIGN KEY ("idMarca") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
