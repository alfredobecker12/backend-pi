import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
    async handle(req: Request, res: Response) {

        const {cnpj, razao_social, email, password} = req.body;

        const updateUserService = new UpdateUserService();

        const updateInfos = updateUserService.execute({
            cnpj,
            razao_social,
            email,
            password
        });

        res.json(updateInfos);
    }
}

export { UpdateUserController };