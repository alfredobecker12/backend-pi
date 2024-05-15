import { Request, Response } from "express";
import { BrandRegisterService } from "../../services/user/BrandRegisterService";

class BrandRegisterController {
    async handle(req: Request, res: Response) {
        const {cnpj_rep, cnpj_marca, razao_social} = req.body;

        const brandRegisterService = new BrandRegisterService();
        
        const marca = await brandRegisterService.execute({
            cnpj_rep,
            cnpj_marca,
            razao_social,
        });

        return res.json(marca);
    }
}

export { BrandRegisterController };