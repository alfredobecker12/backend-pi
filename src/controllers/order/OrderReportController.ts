import { Request, Response, NextFunction } from "express";
import { OrderReportService } from "../../services/order/OrderReportService";

class OrderReportController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj, categoria, opcao } = req.body;

    const orderReportService = new OrderReportService();

    try {
      const newReport = await orderReportService.execute({
        cnpj,
        categoria,
        opcao,
      });

      if (newReport.pdfBuffer) {
        // Se newReport contém pdfBuffer, envia o PDF na resposta
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=relatorio-pedidos.pdf"
        );
        return res.send(newReport.pdfBuffer);
      } else {
        return res.json(newReport);
      }
    } catch (error) {
      next(error);
    }
  }
}

export { OrderReportController };
