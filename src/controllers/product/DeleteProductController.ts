import { Request, Response, NextFunction } from "express";
import { DeleteProductService } from "../../services/product/DeleteProductService";

class DeleteProductController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID do produto é obrigatório" });
      }

      const deleteProductService = new DeleteProductService();
      const result = await deleteProductService.execute(Number(id));
      
      return res.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { DeleteProductController };
