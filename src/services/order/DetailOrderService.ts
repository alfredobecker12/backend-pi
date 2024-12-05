import prismaClient from "../../prisma";
import { AppError } from "../../Errors/appError";

interface UserRequest {
  cnpj: string;
  categoria: string;
}

class DetailOrderService {
  async execute({ cnpj, categoria }: UserRequest) {
    try {
      const whereCondition =
        categoria === "C" ? { cnpj_cli: cnpj } : { cnpj_rep: cnpj };

      // Número total de pedidos para o CNPJ
      const totalPedidos = await prismaClient.pedido.count({
        where: whereCondition,
      });
      // Número total de pedidos no mês atual para o CNPJ
      const inicioMes = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

      const totalPedidosMesAtual = await prismaClient.pedido.count({
        where: {
          ...whereCondition,
          data_pedido: {
            gte: inicioMes,
          },
        },
      });
      const valorTotalPedidos = await prismaClient.pedido.aggregate({
        _sum: {
          valor_total: true,
        },
        where: whereCondition,
      });
      return {
        totalPedidos,
        totalPedidosMesAtual,
        valorTotalPedidos: valorTotalPedidos._sum.valor_total ?? 0,
      };
    } catch (error) {
      throw new AppError(`Erro ao buscar métricas de pedidos: ${error}`, 500);
    }
  }
}

export { DetailOrderService };
