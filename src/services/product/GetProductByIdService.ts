import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

interface UserRequest {
  id: number;
}

class GetProductByIdService {
  async execute({ id }: UserRequest) {
    try {
      if (id) {
        const produto = await prismaClient.produto.findUnique({
          where: {
            id: id,
          },
        });

        if (!produto) {
          throw new AppError(
            "Nenhum produto encontrado para essa categoria",
            404
          );
        }

        return ({
          id: produto.id,
          descricao: produto.descricao,
          validade: produto.validade,
          peso: produto.peso,
          preco: produto.preco,
          imagem: produto.imagem,
          id_cat: produto.id_cat,
          id_marca: produto.cnpj_marca,
        });
      }
    } catch (error) {
      throw new AppError(`Erro ao buscar produto: ${error}`, 500);
    }
  }
}

export { GetProductByIdService };
