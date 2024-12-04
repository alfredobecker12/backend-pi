import prismaClient from "../../prisma";
import { AppError } from "../../Errors/appError";
import { StatusPedido } from "@prisma/client";

interface UserRequest {
  cnpj: string;
}

interface PedidoItem {
  id: number;
  descricao: string;
  quantidade: number;
}

interface PedidoInfo {
  id: number;
  status: StatusPedido;
  valor_total: number;
  cliente: string;
  representante: string;
  produtos: PedidoItem[];
}

class ListOrderService {
  async execute({ cnpj }: UserRequest) {
    try {
      if (!cnpj) {
        throw new AppError("CNPJ não informado na requisição", 400);
      }

      let pedidos: any[];

      // Verificar se o CNPJ pertence a um cliente
      const cliente = await prismaClient.cliente.findUnique({
        where: {
          cnpj: cnpj,
        },
      });

      if (cliente) {
        // Recuperar pedidos associados ao cliente
        pedidos = await prismaClient.pedido.findMany({
          where: {
            cnpj_cli: cnpj,
          },
          include: {
            cliente: true,
            representante: true,
            pedidoProduto: {
              include: {
                produto: true,
              },
            },
          },
          orderBy: {
            data_pedido: "desc",
          },
        });
      } else {
        // Recuperar pedidos associados ao representante
        const representante = await prismaClient.representante.findUnique({
          where: {
            cnpj: cnpj,
          },
        });

        if (!representante) {
          throw new AppError(
            "Nenhum cliente ou representante encontrado com o CNPJ fornecido.",
            500
          );
        }

        pedidos = await prismaClient.pedido.findMany({
          where: {
            cnpj_rep: cnpj,
          },
          include: {
            cliente: true,
            representante: true,
            pedidoProduto: {
              include: {
                produto: true,
              },
            },
          },
          orderBy: {
            data_pedido: "desc",
          },
        });
      }

      // Se nenhum pedido for encontrado, lançar um erro
      if (pedidos.length === 0) {
        throw new AppError(`Nenhum pedido encontrado para o CNPJ ${cnpj}`, 404);
      }

      // Construir a estrutura de retorno com IDs de 1 a n
      const pedidosInfo: PedidoInfo[] = pedidos.map((pedido, index) => ({
        id: index + 1, // ID começando de 1 até n
        status: pedido.status,
        valor_total: pedido.valor_total,
        cliente: pedido.cliente?.razao_social || "",
        representante: pedido.representante?.razao_social || "",
        produtos: pedido.pedidoProduto.map((item: any) => ({
          id: item.produto.id,
          descricao: item.produto.descricao,
          quantidade: item.quantidade,
        })),
      }));

      return pedidosInfo;
    } catch (error) {
        throw new AppError(`Não foi possível buscar os pedidos do CNPJ ${cnpj}: ${error.message}`,500);
    }
  }
}

export { ListOrderService };
