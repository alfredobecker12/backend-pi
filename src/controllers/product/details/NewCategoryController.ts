import { Request, Response, NextFunction } from "express";
import { NewCategoryService } from "../../../services/product/details/NewCategoryService";

class NewCategoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { descricao } = req.body;

    const newCategoryService = new NewCategoryService();

    try {
      const newCategory = await newCategoryService.execute({
        descricao,
      });

      return res.json(newCategory);
    } catch (error) {
      next(error);
    }
  }
}

export { NewCategoryController };
