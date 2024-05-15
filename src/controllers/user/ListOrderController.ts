import { Request, Response } from "express";
import { ListOrderService } from "../../services/user/ListOrderService";

class ListOrderController {
    async handle(req: Request, res: Response) {
        try {
            const {cnpj} = req.body;

            const listOrderService = new ListOrderService();

            const orders = await listOrderService.execute({
                cnpj
            });

            return res.json(orders);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { ListOrderController };
