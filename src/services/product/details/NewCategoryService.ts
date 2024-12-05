import { AppError } from "../../../Errors/appError";
import prismaClient from "../../../prisma";

interface UserRequest {
  descricao: string;
}

class NewCategoryService {
  async execute({ descricao }: UserRequest) {
    try {
      if (!descricao) {
        throw new AppError("Informe a descrição da categoria.", 400);
      }

      const newProductCategory = await prismaClient.categoriaProduto.create({
        data: {
          descricao: descricao,
        },
      });

      return newProductCategory;
    } catch (error) {
      throw new AppError(`Não foi possível criar a categoria: ${error}`, 500);
    }
  }
}

export { NewCategoryService };
