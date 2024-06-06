import { Request, Response, NextFunction } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController{
    async handle(req: Request, res: Response, next: NextFunction) {
        
        const listProductService = new ListProductService();
        
        try {
            const produtos = await listProductService.execute();

            res.json(produtos)

        } catch(error) {
            next(error);
        }
        
    }
}

export { ListProductController };
