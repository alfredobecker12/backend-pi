import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";

interface UserRequest {
  categoria?: string;
}

class ListProductService {
  async execute({ categoria }: UserRequest) {
    try {
      if (categoria) {
        const categoriaFiltro = await prismaClient.categoriaProduto.findFirst({
          where: {
            descricao: categoria,
          },
        });

        if (!categoriaFiltro) {
          throw new AppError("Categoria não encontrada", 404);
        }

        const produtos_filtrados = await prismaClient.produto.findMany({
          where: {
            id_cat: categoriaFiltro.id,
          },
          include: {
            categoriaProduto: true,
            marca: true,
          },
        });

        if (!produtos_filtrados.length) {
          throw new AppError(
            "Nenhum produto encontrado para essa categoria",
            404
          );
        }

        return produtos_filtrados.map((produto) => ({
          id: produto.id,
          descricao: produto.descricao,
          validade: produto.validade,
          peso: produto.peso,
          preco: produto.preco,
          imagem: produto.imagem,
          id_cat: produto.categoriaProduto.descricao,
          id_marca: produto.marca.razao_social,
        }));
      } else {
        const produtos = await prismaClient.produto.findMany({
          where: {
            status: "ATIVO",
          },
          include: {
            categoriaProduto: true,
            marca: true,
          },
        });

        if (!produtos.length) {
          throw new AppError("Nenhum produto encontrado", 404);
        }

        return produtos.map((produto) => ({
          id: produto.id,
          descricao: produto.descricao,
          validade: produto.validade,
          peso: produto.peso,
          preco: produto.preco,
          imagem: produto.imagem,
          id_cat: produto.categoriaProduto.descricao,
          id_marca: produto.marca.razao_social,
        }));
      }
    } catch (error) {
      throw new AppError(`Erro ao buscar produtos: ${error}`, 500);
    }
  }
}

export { ListProductService };
