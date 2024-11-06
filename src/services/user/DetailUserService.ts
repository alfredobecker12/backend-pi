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
        // SE FOR CLIENTE
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
        // SE FOR REPRESENTANTE
        return {
          cnpj: cnpj,
          categoria: "R",
          razao_social: representateTable.razao_social,
          email: representateTable.email,
        };
      }

      // Caso o CNPJ não seja encontrado em nenhuma das tabelas
      throw new AppError("CNPJ não encontrado", 404);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError("Erro interno do servidor", 500);
      }
    }
  }
}

export { DetailUserService };
