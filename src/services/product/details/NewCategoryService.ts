import prismaClient from "../../../prisma";

interface UserRequest {
    descricao: string
}

class NewCategoryService {
    async execute({descricao}: UserRequest) {
        if (!descricao) {
            throw new Error("Informe a descrição da categoria.");
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
