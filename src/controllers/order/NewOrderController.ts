import { Request, Response } from "express";
import { NewOrderService } from "../../services/order/NewOrderService";

class NewOrderController {
    async handle(req: Request, res: Response) {
        try {
            const { cnpj_cli, cnpj_rep, itens } = req.body;

            const newOrderService = new NewOrderService();

            const novoPedido = await newOrderService.execute({
                cnpj_cli,
                cnpj_rep,
                itens,
            });

            return res.json(novoPedido);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { NewOrderController };
