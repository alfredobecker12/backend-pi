import { Request, Response, NextFunction } from "express";
import { NewOrderService } from "../../services/order/NewOrderService";

class NewOrderController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { cnpj_cli, cnpj_rep, itens } = req.body;

        const newOrderService = new NewOrderService();
        
        try {
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
