import prismaClient from "../../prisma";
import MailSender from "../mail/MailSender";
import PDFDocument from "pdfkit";
import { AppError } from "../../Errors/appError";
import { generatePDF } from "../pdf/OrderReportPdf";

interface request{
    "cnpj": string,
    "categoria": string,
    "opcao": string
}

const pdfPath = '../pdf/OrderReportPdf';

class OrderReport {
    async execute({cnpj, categoria, opcao}: request) {
        if(!cnpj || !categoria || !opcao){
            throw new AppError(`Todos os campos devem ser preenchidos\ncnpj:${cnpj}\categoria:${categoria}\nopção:${opcao}.`, 400);
        }

        if(categoria != 'C' || 'R'){
            throw new AppError("Categoria inválida.", 400);
        }

        if(opcao != 'D' || 'E'){
            throw new AppError("Opção inválida.", 400)
        }

        const whereCondition = categoria === 'C' 
        ? { cnpj_cli: cnpj } 
        : { cnpj_rep: cnpj };
    
        try {
            const pedidos = await prismaClient.pedido.findMany({
                where: whereCondition,
                include: {
                    pedidoProduto: {
                    include: {
                        produto: {
                        include: {
                            marca: true,
                        },
                        },
                    },
                    },
                    cliente: true,
                    representante: true,
            },
            });

        generatePDF(pedidos, pdfPath);

            return pedidos;
        } catch (error) {
            throw new AppError(`Erro ao buscar pedidos: ${error.message}`, 500);
        }
    }
}

export { OrderReport }
