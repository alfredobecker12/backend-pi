-- CreateTable
CREATE TABLE "AutenticacaoLogin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "codigo" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutenticacaoLogin_pkey" PRIMARY KEY ("id")
);
