import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

class ListProductService{
    async execute(){
        const produtos = await prismaClient.produto.findMany();
        
        if(!produtos) {
            throw new AppError("Nenhum produto encontrado", 500)
        }

        return produtos
    }
}   

export { ListProductService };