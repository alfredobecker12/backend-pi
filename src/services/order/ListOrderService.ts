import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";
import { StatusPedido } from "@prisma/client";

interface UserRequest {
    cnpj: string
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
    async execute({cnpj}: UserRequest) {

        // Verificar se o CNPJ pertence a um cliente
        const cliente = await prismaClient.cliente.findUnique({
            where: {
                cnpj: cnpj,
            },
        });

        if (cliente) {
            // Recuperar pedidos associados ao cliente
            var pedidos = await prismaClient.pedido.findMany({
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
            });
        } else {
            // Recuperar pedidos associados ao representante
            const representante = await prismaClient.representante.findUnique({
                where: {
                    cnpj: cnpj,
                },
            });

            if (!representante) {
                throw new AppError("Nenhum cliente ou representante encontrado com o CNPJ fornecido.", 500);
            }

            var pedidos = await prismaClient.pedido.findMany({
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
            });
        }

        // Construir a estrutura de retorno
        const pedidosInfo: PedidoInfo[] = pedidos.map((pedido) => ({
            id: pedido.id,
            status: pedido.status,
            valor_total: pedido.valor_total,
            cliente: pedido.cliente?.razao_social || "",
            representante: pedido.representante?.razao_social || "",
            produtos: pedido.pedidoProduto.map((item) => ({
                id: item.produto.id,
                descricao: item.produto.descricao,
                quantidade: item.quantidade,
            })),
        }));

        return pedidosInfo;
    }
}

export { ListOrderService };
