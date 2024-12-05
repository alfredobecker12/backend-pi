import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

interface ProductRequest {
  descricao: string;
  validade?: string; // Opcional
  peso?: number; //Opcional. OBS: Na requisição, se não tiver peso, envie null
  preco: number;
  categoria: string;
  marca: string;
}

class CreateProductService {
  async execute({
    descricao,
    validade,
    peso,
    preco,
    categoria,
    marca,
  }: ProductRequest) {
    try {
      if (!descricao || !preco || !categoria || !marca) {
        throw new AppError(
          "Todos os campos obrigatórios devem ser preenchidos",
          400
        );
      }

      // Verificação da categoria
      const categoriaVerify = await prismaClient.categoriaProduto.findFirst({
        where: {
          descricao: categoria,
        },
      });

      if (!categoriaVerify) {
        throw new AppError("Categoria não encontrada", 400);
      }

      // Verificação da marca
      const marcaVerify = await prismaClient.marca.findFirst({
        where: {
          razao_social: marca,
        },
      });

      if (!marcaVerify) {
        throw new AppError("Marca não encontrada", 400);
      }

      // Verificação se o produto já existe
      const productAlreadyExists = await prismaClient.produto.findFirst({
        where: {
          descricao: descricao,
          validade: validade, // Verifica validade apenas se estiver presente
          peso: peso,
          preco: preco,
          id_cat: categoriaVerify.id,
          cnpj_marca: marcaVerify.cnpj,
        },
      });

      if (productAlreadyExists) {
        throw new AppError("Produto já existe", 400);
      }

      // Criação do novo produto
      const newProductData = {
        descricao: descricao,
        validade: validade || null,
        peso: peso || null,
        preco: preco,
        id_cat: categoriaVerify.id,
        cnpj_marca: marcaVerify.cnpj,
      };

      // Inclui validade se estiver presente
      if (validade) {
        newProductData.validade = validade;
      }

      if (peso) {
        newProductData.peso = peso;
      }

      const newProduct = await prismaClient.produto.create({
        data: newProductData,
      });

      return newProduct;
    } catch (error) {
      throw new AppError(`Erro ao criar produto: ${error}`, 500);
    }
  }
}

export { CreateProductService };
