import PDFDocument from "pdfkit";
import fs from "fs";
import { Pedido, PedidoProduto } from "@prisma/client";
import { AppError } from "../../Errors/appError";

async function generatePDF(
  pedidos: (Pedido & {
    pedidoProduto: (PedidoProduto & {
      produto: {
        descricao: string;
        preco: number;
        marca: { razao_social: string };
      };
    })[];
    cliente: { razao_social: string };
    representante: { razao_social: string };
  })[],
  categoria: string,
  filePath?: string
): Promise<Buffer> {
  try {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      if (filePath) {
        fs.writeFileSync(filePath, pdfBuffer);
      }
    });

    const tituloRelatorio = categoria == "C" ? "Compras" : "Vendas";
    // Formatação data
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };

    doc
      .fontSize(25)
      .text(`Relatório de ${tituloRelatorio}`, { align: "center" });
    doc
      .fontSize(12)
      .text(`Data: ${new Date().toLocaleDateString("pt-BR", options)}`, {
        align: "right",
      });
    doc.moveDown();

    // Pedidos
    pedidos.forEach((pedido, index) => {
      doc.fontSize(16).text(`Pedido ${index + 1}`, { bold: true });
      doc
        .fontSize(14)
        .text(`Data do Pedido: ${pedido.data_pedido.toLocaleDateString()}`);
      doc.fontSize(14).text(`CNPJ Cliente: ${pedido.cnpj_cli}`);
      doc
        .fontSize(14)
        .text(`Razão Social Cliente: ${pedido.cliente.razao_social}`);
      doc.fontSize(14).text(`CNPJ Representante: ${pedido.cnpj_rep}`);
      doc
        .fontSize(14)
        .text(
          `Razão Social Representante: ${pedido.representante.razao_social}`
        );
      doc.fontSize(14).text(`Valor Total: R$ ${pedido.valor_total.toFixed(2)}`);
      doc.moveDown();

      pedido.pedidoProduto.forEach((item, idx) => {
        doc
          .fontSize(12)
          .text(`  Produto ${idx + 1}: ${item.produto.descricao}`);
        doc.fontSize(12).text(`  Quantidade: ${item.quantidade}`);
        doc.fontSize(12).text(`  Preço: R$ ${item.produto.preco.toFixed(2)}`);
        doc.fontSize(12).text(`  Marca: ${item.produto.marca.razao_social}`);
        doc.moveDown();
      });

      doc
        .moveDown()
        .text("----------------------------------------", { align: "center" });
      doc.moveDown();
    });

    doc.end();
    return new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });
  } catch (error) {
    throw new AppError(`Erro ao gerar o PDF: ${error}`, 501);
  }
}

export { generatePDF };
