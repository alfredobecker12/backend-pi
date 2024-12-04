import prismaClient from "../../prisma";
import MailSender from "../mail/MailSender";
import { AppError } from "../../Errors/appError";
import { generatePDF } from "../pdf/OrderReportPdf";

interface request {
  cnpj: string;
  categoria: string;
  opcao: string;
}

const pdfPath = "C:/Users/Alfredo/Desktop/testeaaa/backend-repnet/src/services/pdf/OrderReportPdf/relatorio-pedidos.pdf";

class OrderReportService {
  userData: any;

  async execute({ cnpj, categoria, opcao }: request) {
    if (!cnpj || !categoria || !opcao) {
      throw new AppError(
        `Todos os campos devem ser preenchidos\ncnpj:${cnpj}\ncategoria:${categoria}\nopção:${opcao}.`,
        400
      );
    }

    if (categoria !== "C" && categoria !== "R") {
      throw new AppError("Categoria inválida.", 400);
    }

    if (opcao !== "D" && opcao !== "E") {
      throw new AppError("Opção inválida.", 400);
    }

    const whereCondition = categoria === "C" ? { cnpj_cli: cnpj } : { cnpj_rep: cnpj };

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
        orderBy: {
          data_pedido: 'desc',
        },
      });

      if (categoria === "C") {
        this.userData = await prismaClient.cliente.findFirst({
          where: {
            cnpj: cnpj,
          },
        });
      } else {
        this.userData = await prismaClient.representante.findFirst({
          where: {
            cnpj: cnpj,
          },
        });
      }

      try {
        await generatePDF(pedidos, pdfPath);
      } catch (error) {
        throw new AppError(`Erro ao gerar pdf: ${error}`, 500);
      }

      if (opcao === "D") {
        return pdfPath;
      } else {
        const subject = "Relatório de vendas";
        const text = `Segue abaixo o relatório de vendas da ${this.userData.razao_social}`;

        try {
          await MailSender.sendMail(this.userData.email, subject, text, [
            { filename: "relatorio.pdf", path: pdfPath },
          ]);
        } catch (error) {
          throw new AppError(`Erro ao enviar o relatório: ${error}`, 500);
        }

        return {
          message: "Relatório enviado para o email com sucesso.",
        };
      }
    } catch (error) {
      throw new AppError(`Erro ao buscar pedidos: ${error.message}`, 500);
    }
  }
}

export { OrderReportService };
