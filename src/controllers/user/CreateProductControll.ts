import { Request, Response } from "express";
import { CreateProductService } from "../../services/user/CreateProductService";

class CreateProductController {
    async handle(req: Request, res: Response) {
        const {descricao, validade, peso, preco, categoria, marca} = req.body;

        const createProductService = new CreateProductService();

        const product = await createProductService.execute({
            descricao,
            validade,
            peso,
            preco,
            categoria,
            marca,
        });
    
        return res.json(product);
    }
}

export { CreateProductController };


