import prismaClient from "../../prisma";
import MailSender from "../mail/MailSender";
import { AppError } from "../../Errors/appError";

interface PedidoRequest {
  id_pedido: number;
}

class SendOrderService {
  async execute({ id_pedido }: PedidoRequest) {
    try {
      const pedidoData = await prismaClient.pedido.findFirst({
        where: { id: id_pedido },
        select: {
          cnpj_cli: true,
          cnpj_rep: true,
          valor_total: true,
          pedidoProduto: {
            select: {
              quantidade: true,
              produto: {
                select: {
                  descricao: true,
                  preco: true,
                },
              },
            },
          },
        },
      });

      if (!pedidoData) {
        throw new AppError("Pedido não encontrado", 404);
      }

      const clientData = await prismaClient.cliente.findFirst({
        where: { cnpj: pedidoData.cnpj_cli },
      });

      if (!clientData) {
        throw new AppError("Cliente não encontrado", 404);
      }

      const repData = await prismaClient.representante.findFirst({
        where: { cnpj: pedidoData.cnpj_rep },
      });

      if (!repData) {
        throw new AppError("Representante não encontrado", 404);
      }

      // Formatação do valor total para "R$50.000,00"
      const formattedValorTotal = pedidoData.valor_total.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      );

      // Construção dos detalhes do pedido
      const pedidoDetalhes = pedidoData.pedidoProduto
        .map(
          (item) => `
        Produto: ${item.produto.descricao}
        Quantidade: ${item.quantidade}
        Preço Unitário: R$${item.produto.preco.toLocaleString("pt-BR")}
        `
        )
        .join("\n");

      const subject = `Pedido realizado por ${clientData.razao_social}`;
      const text = `Olá ${repData.razao_social},

      Um novo pedido foi realizado pelo cliente ${clientData.razao_social}.

      Detalhes do pedido:
      ID do Pedido: ${id_pedido}
      CNPJ do Cliente: ${pedidoData.cnpj_cli}
      CNPJ do Representante: ${pedidoData.cnpj_rep}
      Valor Total: ${formattedValorTotal}

      Itens do Pedido:
      ${pedidoDetalhes}

      Atenciosamente,
      Equipe Repnet`;

      // Enviar o e-mail
      await MailSender.sendMail(
        [repData.email, clientData.email],
        subject,
        text
      );
      console.log("Email enviado com sucesso");
    
      return;
    
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw new AppError("Erro ao enviar email", 500);
    }
  }
}

export { SendOrderService };
