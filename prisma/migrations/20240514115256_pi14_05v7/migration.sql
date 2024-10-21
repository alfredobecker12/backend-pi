/*
  Warnings:

  - You are about to drop the column `categoria_cliente` on the `Representante` table. All the data in the column will be lost.
  - Added the required column `categoria_representante` to the `RepresentanteMarca` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Representante" DROP COLUMN "categoria_cliente";

-- AlterTable
ALTER TABLE "RepresentanteMarca" ADD COLUMN     "categoria_representante" "CatCliente" NOT NULL,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
