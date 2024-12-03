import prismaClient from "../../prisma";
import MailSender from "../mail/MailSender";
import { Cliente, Representante } from "@prisma/client";
import { AppError } from "../../Errors/appError";
import { generatePDF } from "../pdf/OrderReportPdf";

interface request {
  cnpj: string;
  categoria: string;
  opcao: string;
}

const pdfPath = "../pdf/OrderReportPdf/relatorio-pedidos.pdf";
class OrderReport {
  userData: any;

  async execute({ cnpj, categoria, opcao }: request) {
    if (!cnpj || !categoria || !opcao) {
      throw new AppError(
        `Todos os campos devem ser preenchidos\ncnpj:${cnpj}\categoria:${categoria}\nopção:${opcao}.`,
        400
      );
    }

    if (categoria != "C" || "R") {
      throw new AppError("Categoria inválida.", 400);
    }

    if (opcao != "D" || "E") {
      throw new AppError("Opção inválida.", 400);
    }

    const whereCondition =
      categoria === "C" ? { cnpj_cli: cnpj } : { cnpj_rep: cnpj };

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
    
      if (categoria == "C") {
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
        generatePDF(pedidos, pdfPath);
      } catch (error) {
        throw new AppError(`Erro ao gerar pdf:${error}`, 500);
      }

      if (opcao == "D") {
      } else {
        const subject = "Relatório de vendas";
        const text = `Segue abaixo o relatório de vendas da ${this.userData.razao_social}`;

        try {
          await MailSender.sendMail(this.userData.email, subject, text, [
            { filename: "relatorio.pdf", path: pdfPath },
          ]);
        } catch (error) {
          throw new AppError(`Erro ao enviar o relatório:${error}`, 500);
        }
      }

      return pedidos;
    } catch (error) {
      throw new AppError(`Erro ao buscar pedidos: ${error.message}`, 500);
    }
  }
}

export { OrderReport };
