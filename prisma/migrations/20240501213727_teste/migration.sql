-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'CANCELADO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Representante" (
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "status" "StatusUser" NOT NULL,
    "email" TEXT NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_log" INTEGER NOT NULL,

    CONSTRAINT "Representante_pkey" PRIMARY KEY ("cnpj")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "status" "StatusUser" NOT NULL,
    "email" TEXT NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_log" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("cnpj")
);

-- CreateTable
CREATE TABLE "Login" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" SERIAL NOT NULL,
    "razao_social" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaProduto" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "CategoriaProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "peso" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "id_cat" INTEGER NOT NULL,
    "id_marca" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL,
    "status" "StatusPedido" NOT NULL,
    "valor_total" DOUBLE PRECISION NOT NULL,
    "cnpj_cli" TEXT NOT NULL,
    "cnpj_rep" TEXT NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoProduto" (
    "id_prod" INTEGER NOT NULL,
    "id_ped" INTEGER NOT NULL,

    CONSTRAINT "PedidoProduto_pkey" PRIMARY KEY ("id_prod","id_ped")
);

-- CreateIndex
CREATE UNIQUE INDEX "Login_password_key" ON "Login"("password");

-- AddForeignKey
ALTER TABLE "Representante" ADD CONSTRAINT "Representante_id_log_fkey" FOREIGN KEY ("id_log") REFERENCES "Login"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_log_fkey" FOREIGN KEY ("id_log") REFERENCES "Login"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_cat_fkey" FOREIGN KEY ("id_cat") REFERENCES "CategoriaProduto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cnpj_cli_fkey" FOREIGN KEY ("cnpj_cli") REFERENCES "Cliente"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cnpj_rep_fkey" FOREIGN KEY ("cnpj_rep") REFERENCES "Representante"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProduto" ADD CONSTRAINT "PedidoProduto_id_ped_fkey" FOREIGN KEY ("id_ped") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProduto" ADD CONSTRAINT "PedidoProduto_id_prod_fkey" FOREIGN KEY ("id_prod") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
