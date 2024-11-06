import { Request, Response, NextFunction } from "express";
import { ListCategoryService } from "../../../services/product/details/ListCategorysService";

class ListCategoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const listCategoryService = new ListCategoryService();

    try {
      const categorys = await listCategoryService.execute();

      return res.json(categorys);
    } catch (error) {
      next(error);
    }
  }
}

export { ListCategoryController };
