import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

interface UserRequest {
    categoria?: string;
}

class ListProductService {
    async execute({ categoria }: UserRequest) {
        
        try {
            
            if (categoria) {
                const categoria_id = await prismaClient.categoriaProduto.findFirst({
                    where: {
                        descricao: categoria,
                    }
                });

                if (!categoria_id) {
                    throw new AppError("Categoria não encontrada", 404);
                }

                const produtos_filtrados = await prismaClient.produto.findMany({
                    where: {
                        id_cat: categoria_id.id,
                    }
                });

                if (!produtos_filtrados.length) {
                    throw new AppError("Nenhum produto encontrado para essa categoria", 404);
                }

                return produtos_filtrados;
            
            } else {
                const produtos = await prismaClient.produto.findMany();

                if (!produtos.length) {
                    throw new AppError("Nenhum produto encontrado", 404);
                }

                return produtos;
            }
        
        } catch(error) {
           
            if(error instanceof AppError) {
                throw error;
            
            } else {
                throw new AppError(`Erro ao buscar produtos: ${error}`, 500);
            }
            
        }
    }
}

export { ListProductService };
