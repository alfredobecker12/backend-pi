import { Request, Response, NextFunction } from "express";
import { BrandRegisterService } from "../../../services/product/details/BrandRegisterService";

class BrandRegisterController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const {cnpj_rep, cnpj_marca, razao_social} = req.body;

        const brandRegisterService = new BrandRegisterService();
        
        try {
            const marca = await brandRegisterService.execute({
                cnpj_rep,
                cnpj_marca,
                razao_social,
            });
    
            return res.json(marca);

        } catch (error) {
            next(error);
        }
    }
}

export { BrandRegisterController };