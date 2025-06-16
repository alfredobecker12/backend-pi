import { Request, Response, NextFunction } from "express";
import { GetProductByIdService } from "../../services/product/GetProductByIdService";

class GetProductByIdController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.query.id);

      if (!productId) {
        return res.status(400).json({ error: "ID do produto é obrigatório" });
      }

      const updateProductService = new GetProductByIdService();

      const product = await updateProductService.execute({
        id: productId,
      });

      return res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

export { GetProductByIdController };
