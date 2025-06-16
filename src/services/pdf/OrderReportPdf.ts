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

    const tituloRelatorio = categoria === "C" ? "Compras" : "Vendas";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    // Constants for layout
    const margin = 50;
    const labelX = margin;
    const valueX = 250;
    const descX = margin;
    const quantX = 250;
    const precoX = 350;
    const marcaX = 450;
    const lineHeight = 20;
    const fontSizeTitle = 25;
    const fontSizeSubtitle = 16;
    const fontSizeNormal = 12;
    const fontSizeSmall = 10;
    let y = margin;

    // Header: Title and Date
    doc.fontSize(fontSizeTitle).text(`Relatório de ${tituloRelatorio}`, margin, y, { align: "center" });
    y += lineHeight * 2;
    doc.fontSize(fontSizeNormal).text(`Data: ${new Date().toLocaleDateString("pt-BR", options)}`, margin, y, { align: "right" });
    y += lineHeight * 2;

    // Helper function to check for page breaks
    function checkPageBreak(heightNeeded: number) {
      if (y + heightNeeded > doc.page.height - margin) {
        doc.addPage();
        y = margin;
      }
    }

    // Helper function to print label-value pairs
    function printLabelValue(label: string, value: string) {
      doc.fontSize(fontSizeNormal).text(label, labelX, y);
      doc.text(value, valueX, y);
      y += lineHeight;
    }

    // Helper function to print product rows
    function printProdutoRow(descricao: string, quantidade: string, preco: string, marca: string) {
      doc.fontSize(fontSizeSmall).text(descricao, descX, y, { width: 180 });
      doc.text(quantidade, quantX, y);
      doc.text(preco, precoX, y);
      doc.text(marca, marcaX, y);
      y += lineHeight;
    }

    // Process each pedido
    pedidos.forEach((pedido, index) => {
      // Check if there's enough space for pedido details (approx. 7 lines)
      checkPageBreak(7 * lineHeight);

      // Pedido Header
      doc.fontSize(fontSizeSubtitle).text(`Pedido ${index + 1}`, margin, y);
      y += lineHeight;

      // Pedido Details in two-column format
      printLabelValue("Data do Pedido:", pedido.data_pedido.toLocaleDateString("pt-BR", options));
      printLabelValue("CNPJ Cliente:", pedido.cnpj_cli);
      printLabelValue("Razão Social Cliente:", pedido.cliente.razao_social);
      printLabelValue("CNPJ Representante:", pedido.cnpj_rep);
      printLabelValue("Razão Social Representante:", pedido.representante.razao_social);
      printLabelValue("Valor Total:", `R$ ${pedido.valor_total.toFixed(2)}`);
      y += lineHeight / 2;

      // Products Header
      doc.fontSize(fontSizeSmall)
        .text("Descrição", descX, y)
        .text("Quantidade", quantX, y)
        .text("Preço", precoX, y)
        .text("Marca", marcaX, y);
      y += lineHeight;

      // Product Rows
      pedido.pedidoProduto.forEach((item) => {
        printProdutoRow(
          item.produto.descricao,
          item.quantidade.toString(),
          `R$ ${item.produto.preco.toFixed(2)}`,
          item.produto.marca.razao_social
        );
      });

      // Separator
      y += lineHeight;
      doc.moveTo(margin, y).lineTo(doc.page.width - margin, y).stroke();
      y += lineHeight;
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