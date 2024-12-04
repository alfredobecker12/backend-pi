import { Request, Response, NextFunction } from "express";
import { DetailOrderService } from "../../services/order/DetailOrderService";

class DetailOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj, categoria } = req.body;

    const detailOrderService = new DetailOrderService();

    try {
      const detailOrder = await detailOrderService.execute({ cnpj, categoria });
      console.log(detailOrder);
      return res.json(detailOrder);
    } catch (error) {
      next(error);
    }
  }
}

export { DetailOrderController };
