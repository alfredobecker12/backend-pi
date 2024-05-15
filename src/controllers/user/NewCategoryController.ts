import { Request, Response } from "express";
import { NewCategoryService } from "../../services/user/NewCategoryService";

class NewCategoryController {
    async handle(req: Request, res: Response) {
        try {
            const {descricao} = req.body;

            const newCategoryService = new NewCategoryService();

            const newCategory = await newCategoryService.execute({
                descricao,
            });

            return res.json(newCategory);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { NewCategoryController };
