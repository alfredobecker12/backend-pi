import { Request, Response, NextFunction } from "express";
import { ListOrderService } from "../../services/order/ListOrderService";

class ListOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj } = req.body;

    const listOrderService = new ListOrderService();

    try {
      const orders = await listOrderService.execute({
        cnpj,
      });

      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}

export { ListOrderController };
