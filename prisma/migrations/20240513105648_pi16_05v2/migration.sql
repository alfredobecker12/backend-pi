/*
  Warnings:

  - The primary key for the `Marca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Marca` table. All the data in the column will be lost.
  - You are about to drop the column `id_marca` on the `Produto` table. All the data in the column will be lost.
  - The primary key for the `RepresentanteMarca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cnpjRepresentante` on the `RepresentanteMarca` table. All the data in the column will be lost.
  - You are about to drop the column `idMarca` on the `RepresentanteMarca` table. All the data in the column will be lost.
  - Added the required column `cnpj` to the `Marca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_marca` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_marca` to the `RepresentanteMarca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_representante` to the `RepresentanteMarca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_id_marca_fkey";

-- DropForeignKey
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_cnpjRepresentante_fkey";

-- DropForeignKey
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_idMarca_fkey";

-- AlterTable
ALTER TABLE "Marca" DROP CONSTRAINT "Marca_pkey",
DROP COLUMN "id",
ADD COLUMN     "cnpj" TEXT NOT NULL,
ADD CONSTRAINT "Marca_pkey" PRIMARY KEY ("cnpj");

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "id_marca",
ADD COLUMN     "cnpj_marca" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RepresentanteMarca" DROP CONSTRAINT "RepresentanteMarca_pkey",
DROP COLUMN "cnpjRepresentante",
DROP COLUMN "idMarca",
ADD COLUMN     "cnpj_marca" TEXT NOT NULL,
ADD COLUMN     "cnpj_representante" TEXT NOT NULL,
ADD CONSTRAINT "RepresentanteMarca_pkey" PRIMARY KEY ("cnpj_representante", "cnpj_marca");

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_cnpj_representante_fkey" FOREIGN KEY ("cnpj_representante") REFERENCES "Representante"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentanteMarca" ADD CONSTRAINT "RepresentanteMarca_cnpj_marca_fkey" FOREIGN KEY ("cnpj_marca") REFERENCES "Marca"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_cnpj_marca_fkey" FOREIGN KEY ("cnpj_marca") REFERENCES "Marca"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;