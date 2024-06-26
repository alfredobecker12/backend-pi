import nodemailer from 'nodemailer';
import prismaClient from '../../prisma';
import { AppError } from '../../Errors/appError';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

if (!process.env.USER || !process.env.USER_PASS) {
    throw new Error('As variáveis de ambiente USER e USER_PASS devem estar definidas');
}

interface PedidoRequest {
    id_pedido: number;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.USER_PASS
    }
});

class SendMailService {
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
                                    preco: true
                                }
                            }
                        }
                    }
                }
            });

            if (!pedidoData) {
                throw new AppError('Pedido não encontrado', 404);
            }

            const clientData = await prismaClient.cliente.findFirst({
                where: { cnpj: pedidoData.cnpj_cli }
            });

            if (!clientData) {
                throw new AppError('Cliente não encontrado', 404);
            }

            const repData = await prismaClient.representante.findFirst({
                where: { cnpj: pedidoData.cnpj_rep }
            });

            if (!repData) {
                throw new AppError('Representante não encontrado', 404);
            }

            let pedidoDetalhes = '';
            pedidoData.pedidoProduto.forEach((item) => {
                pedidoDetalhes += `Produto: ${item.produto.descricao}\nQuantidade: ${item.quantidade}\nPreço Unitário: R$${item.produto.preco}\n\n`;
            });

            const mailOptions = {
                from: {
                    name: 'Repnet',
                    address: process.env.USER
                },
                to: repData.email,
                subject: `Pedido realizado por ${clientData.razao_social}`,
                text: `Olá ${repData.razao_social},

Um novo pedido foi realizado pelo cliente ${clientData.razao_social}.

Detalhes do pedido:
ID do Pedido: ${id_pedido}
CNPJ do Cliente: ${pedidoData.cnpj_cli}
CNPJ do Representante: ${pedidoData.cnpj_rep}
Valor Total: R$${pedidoData.valor_total}

Itens do Pedido:
${pedidoDetalhes}

Atenciosamente,
Equipe Repnet`
            };

            await transporter.sendMail(mailOptions);
            console.log('Email enviado com sucesso');
        
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new AppError('Erro ao enviar email', 500);
        }
    }
}

export { SendMailService };
