import { AppError } from "../../../Errors/appError";
import prismaClient from "../../../prisma";

class ListCategoryService {
    async execute() {

        try {
            const categorys = await prismaClient.categoriaProduto.findMany();

            if(!categorys) {
                throw new AppError("Não foram encontradas categorias registras", 404);
            
            } else {
                return categorys;
            }
            
        } catch(error) {

            if(error instanceof AppError) {
                throw error;
            
            }else {
                throw new AppError(`Erro ao buscar as categorias: ${error}`, 500);
            }
        }

    }
}

export { ListCategoryService };
