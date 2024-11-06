import { AppError } from "../../../Errors/appError";
import prismaClient from "../../../prisma";

class ListCategoryService {
  async execute() {
    try {
      const categories = await prismaClient.categoriaProduto.findMany();

      if (!categories) {
        throw new AppError("Não foram encontradas categorias registras", 404);
      } else {
        return categories.map((category) => ({
          id: category.id,
          nome: category.descricao,
        }));
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(`Erro ao buscar as categorias: ${error}`, 500);
      }
    }
  }
}

export { ListCategoryService };
