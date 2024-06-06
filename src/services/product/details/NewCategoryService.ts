import { AppError } from "../../../Errors/appError";
import prismaClient from "../../../prisma";

interface UserRequest {
    descricao: string
}

class NewCategoryService {
    async execute({descricao}: UserRequest) {
        if (!descricao) {
            throw new AppError("Informe a descrição da categoria.", 400);
        }
        
        const newProductCategory = await prismaClient.categoriaProduto.create({
            data: {
                descricao: descricao
            }
        });
        return newProductCategory;
    }
}

export { NewCategoryService };
