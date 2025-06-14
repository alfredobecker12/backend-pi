import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

class DeleteProductService {
  async execute(id: number) {
    try {
      if (!id) {
        throw new AppError("ID do produto é obrigatório", 400);
      }

      // Verificar se o produto existe
      const productExists = await prismaClient.produto.findUnique({
        where: {
          id: id
        }
      });

      if (!productExists) {
        throw new AppError("Produto não encontrado", 404);
      }

      // Verificar se o produto já está inativo
      if (productExists.status === "INATIVO") {
        throw new AppError("Produto já está inativo", 400);
      }


      // Atualizar o status do produto para INATIVO
      const updatedProduct = await prismaClient.produto.update({
        where: {
          id: id
        },
        data: {
          status: "INATIVO"
        }
      });

      return {
        message: "Produto deletado com sucesso"
      };
    } catch (error) {
      throw new AppError(`Erro ao desativar produto: ${error}`, 500);
    }
  }
}

export { DeleteProductService };
