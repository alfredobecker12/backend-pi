import { Request, Response, NextFunction } from "express";
import { NewOrderService } from "../../services/order/NewOrderService";

class NewOrderController {
    async handle(req: Request, res: Response, next: NextFunction) {
        
        const newOrderService = new NewOrderService();
        
        try {
            const { cnpj_cli, cnpj_rep, itens } = req.body;

            const novoPedido = await newOrderService.execute({
                cnpj_cli,
                cnpj_rep,
                itens,
            });

            return res.json(novoPedido);
        } catch (error) {
            next(error);
        }
    }
}

export { NewOrderController };
