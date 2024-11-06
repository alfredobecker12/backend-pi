import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";
import { StatusPedido } from "@prisma/client";

interface ItemPedido {
  id_prod: number;
  quantidade: number;
}

interface UserRequest {
  cnpj_cli: string;
  cnpj_rep: string;
  itens: ItemPedido[];
}

class NewOrderService {
  async execute({ cnpj_cli, cnpj_rep, itens }: UserRequest) {
    try {
      if (!cnpj_cli || !cnpj_rep || !itens) {
        throw new AppError(
          "Todos os campos da requisição devem ser preenchidos",
          400
        );
      }

      // Verifica se o array de itens está vazio
      if (itens.length === 0) {
        throw new AppError("O pedido deve conter pelo menos um item", 400);
      }

      const repVerify = await prismaClient.representante.findFirst({
        where: {
          cnpj: cnpj_rep,
        },
      });

      if (!repVerify) {
        throw new AppError("Representante não encontrado.", 400);
      }

      const cliVerify = await prismaClient.cliente.findFirst({
        where: {
          cnpj: cnpj_cli,
        },
      });

      if (!cliVerify) {
        throw new AppError("Cliente não encontrado.", 400);
      }

      const pedidoItems = await Promise.all(
        itens.map(async (item) => {
          const produto = await prismaClient.produto.findUnique({
            where: {
              id: item.id_prod,
            },
          });

          if (!produto) {
            throw new AppError(
              `Produto com ID ${item.id_prod} não encontrado.`,
              400
            );
          }
          return {
            id_prod: produto.id,
            quantidade: item.quantidade,
            preco: produto.preco, // Adicionando o preço do produto
          };
        })
      );

      const valor_total = pedidoItems.reduce((acc, curr) => {
        const preco = curr.preco; // Obter preço do produto
        const quantidade = curr.quantidade;
        return acc + preco * quantidade;
      }, 0);

      const novoPedido = await prismaClient.pedido.create({
        data: {
          status: StatusPedido.PENDENTE,
          valor_total,
          cnpj_cli,
          cnpj_rep,
          pedidoProduto: {
            create: pedidoItems.map((item) => ({
              produto: { connect: { id: item.id_prod } },
              quantidade: item.quantidade,
            })),
          },
        },
        include: {
          pedidoProduto: true,
        },
      });

      return novoPedido.id;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(`Não foi possível criar um pedido: ${error}`, 500);
      }
    }
  }
}

export { NewOrderService };
