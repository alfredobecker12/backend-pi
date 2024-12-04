import { Request, Response, NextFunction } from "express";
import { SendOrderService } from "../../services/order/SendOrderService";

class SendOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id_pedido } = req.body;

    const sendOrderService = new SendOrderService();

    try {
      await sendOrderService.execute({ id_pedido });

      return res.json({ message: "Email enviado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

export { SendOrderController };
