import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

interface UserRequest { //Cria a interface de como deve ser a estrutura dos dados para criação de um produto
    descricao: string;
    validade: string;
    peso: number;
    preco: number;
    categoria: string;
    marca: string;
}

class CreateProductService {
    async execute({descricao, validade, peso, preco, categoria, marca}: UserRequest) { 
        
        const categoriaVerify = await prismaClient.categoriaProduto.findFirst({
            where: {
                descricao: categoria,
            }
        });

        if (!categoriaVerify) { 
            throw new AppError("Campo categoria não pode ser nulo", 400);
        }
        
        const marcaVerify = await prismaClient.marca.findFirst({
            where: {
                razao_social: marca,
            }
        });

        if (!marcaVerify) {
            throw new AppError("Campo marca não pode ser nulo.", 400);
        }

        const productAlreadyExists = await prismaClient.produto.findFirst({
            where:{
                descricao: descricao,
                validade: validade,
                peso: peso,
                preco: preco,
                id_cat: categoriaVerify.id,
                cnpj_marca: marcaVerify.cnpj,
            }
        });
    
        if (productAlreadyExists) {
            throw new AppError("Produto já existe.", 500);
        }
        
        const newProduct = await prismaClient.produto.create({
            data: {
                descricao: descricao,
                validade: validade,
                peso: peso,
                preco: preco,
                id_cat: categoriaVerify.id,
                cnpj_marca: marcaVerify.cnpj,
            }
        });
        
        return newProduct;

    }
}

export { CreateProductService};
