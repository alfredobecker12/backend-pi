import { Request, Response, NextFunction } from "express";
import { OrderReportService } from "../../services/order/OrderReportService";
import path from "path";

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

      if (typeof newReport === "string") {
        const pdfPath = path.resolve(__dirname, newReport);
        return res.sendFile(pdfPath);
      
      } else {
        return res.json(newReport);
      }
    } catch (error) {
      next(error);
    }
  }
}

export { OrderReportController };
