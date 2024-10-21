import { Request, Response, NextFunction } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const {descricao, validade, peso, preco, categoria, marca} = req.body;

        const createProductService = new CreateProductService();
        
        try {
            const product = await createProductService.execute({
                descricao,
                validade,
                peso,
                preco,
                categoria,
                marca,
            });
        
            return res.json(product);

        } catch (error) {
            next(error);
        }
        
    }

}

export { CreateProductController };
