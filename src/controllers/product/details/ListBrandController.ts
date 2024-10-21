import { Request, Response, NextFunction } from "express";
import { ListBrandService } from "../../../services/product/details/ListBrandService"; 

class ListBrandController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const listBrandService = new ListBrandService();

        try { 
            const categorys = await listBrandService.execute();

            return res.json(categorys);
        
        } catch (error) {
            next(error);
        }
    }
}

export { ListBrandController };
