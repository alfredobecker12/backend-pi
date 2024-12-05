import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

class DetailUserService {
  async execute(cnpj: string) {
    try {
      const clientTable = await prismaClient.cliente.findFirst({
        where: {
          cnpj: cnpj,
        },
      });

      if (clientTable) {
        return {
          cnpj: cnpj,
          categoria: "C",
          razao_social: clientTable.razao_social,
          email: clientTable.email,
        };
      }

      const representateTable = await prismaClient.representante.findFirst({
        where: {
          cnpj: cnpj,
        },
      });

      if (representateTable) {
        return {
          cnpj: cnpj,
          categoria: "R",
          razao_social: representateTable.razao_social,
          email: representateTable.email,
        };
      }

      throw new AppError("CNPJ não encontrado", 404);
    } catch (error) {
      throw new AppError("Erro interno do servidor", 500);
    }
  }
}

export { DetailUserService };
