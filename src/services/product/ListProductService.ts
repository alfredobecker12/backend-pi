import prismaClient from "../../prisma";

class ListProductService{
    async execute(){
        const produtos = await prismaClient.produto.findMany();
        
        if(!produtos) {
            throw new Error("Nenhum produto encontrado")
        }

        return produtos
    }
}   

export { ListProductService };