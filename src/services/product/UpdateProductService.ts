import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

interface ProductRequest {
  id: number;
  descricao?: string;
  validade?: string;
  peso?: number;
  preco?: number;
  categoria?: string;
  marca?: string;
  imagem?: Buffer;
}

class UpdateProductService {
  async execute({
    id,
    descricao,
    validade,
    peso,
    preco,
    categoria,
    marca,
    imagem,
  }: ProductRequest) {
    try {
      if (!id) {
        throw new AppError("ID do produto é obrigatório", 400);
      }

      // Verificar se o produto existe
      const productExists = await prismaClient.produto.findUnique({
        where: {
          id: id
        }
      });

      if (!productExists) {
        throw new AppError("Produto não encontrado", 404);
      }

      // Preparar dados para atualização
      const updateData: any = {};

      // Atualizar apenas os campos que foram fornecidos
      if (descricao) updateData.descricao = descricao;
      if (validade !== undefined) updateData.validade = validade;
      if (peso !== undefined) updateData.peso = peso;
      if (preco) updateData.preco = preco;
      if (imagem) updateData.imagem = imagem;

      // Verificar e atualizar categoria se fornecida
      if (categoria) {
        const categoriaVerify = await prismaClient.categoriaProduto.findFirst({
          where: {
            descricao: categoria,
          },
        });

        if (!categoriaVerify) {
          throw new AppError("Categoria não encontrada", 400);
        }
        updateData.id_cat = categoriaVerify.id;
      }

      // Verificar e atualizar marca se fornecida
      if (marca) {
        const marcaVerify = await prismaClient.marca.findFirst({
          where: {
            razao_social: marca,
          },
        });

        if (!marcaVerify) {
          throw new AppError("Marca não encontrada", 400);
        }
        updateData.cnpj_marca = marcaVerify.cnpj;
      }

      // Atualizar o produto
      const updatedProduct = await prismaClient.produto.update({
        where: {
          id: id
        },
        data: updateData,
      });

      return updatedProduct;
    } catch (error) {
      throw new AppError(`Erro ao atualizar produto: ${error}`, 500);
    }
  }
}

export { UpdateProductService };
