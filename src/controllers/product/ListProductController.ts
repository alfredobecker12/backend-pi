import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController{
    async handle(req: Request, res: Response) {
        
        const listProductService = new ListProductService();
    
        const produtos = await listProductService.execute();

        res.json(produtos)
    }
}

export { ListProductController };
