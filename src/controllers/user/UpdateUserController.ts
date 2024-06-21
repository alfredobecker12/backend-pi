import { Request, Response, NextFunction } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
    async handle(req: Request, res: Response, next: NextFunction) {

        const {cnpj, razao_social, email, password} = req.body;

        const updateUserService = new UpdateUserService();
        
        try {
            const updateInfos = await updateUserService.execute({
                cnpj,
                razao_social,
                email,
                password
            });
    
            res.json(updateInfos);
        
        } catch (error) {
            next(error);
        }
        
    }
}

export { UpdateUserController };