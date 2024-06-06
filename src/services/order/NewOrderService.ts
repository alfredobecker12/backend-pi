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
    async execute({cnpj_cli, cnpj_rep, itens}: UserRequest) {
        const pedidoItems = await Promise.all(
            
            itens.map(async (item) => {
                const produto = await prismaClient.produto.findUnique({
                    where: {
                        id: item.id_prod,
                    },
                });
                if (!produto) {
                    throw new AppError(`Produto com ID ${item.id_prod} não encontrado.`, 500);
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
            return acc + (preco * quantidade);
        }, 0);

        const novoPedido = await prismaClient.pedido.create({
            data: {
                data_pedido: new Date(),
                status: StatusPedido.PENDENTE,
                valor_total,
                cnpj_cli,
                cnpj_rep,
                pedidoProduto: {
                    create: pedidoItems.map(item => ({
                        produto: { connect: { id: item.id_prod } },
                        quantidade: item.quantidade,
                    }))
                },
            },
            include: {
                pedidoProduto: true
            }
        });

        return novoPedido;
    }
}

export { NewOrderService };
