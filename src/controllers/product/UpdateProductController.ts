import { Request, Response, NextFunction } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";
import multer from "multer";

interface MulterRequest extends Request {
  file?: multer.File;
}

class UpdateProductController {
  async handle(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const productData = JSON.parse(req.body.data);
      const imageFile = req.file;

      if (!productData.id) {
        return res.status(400).json({ error: "ID do produto é obrigatório" });
      }

      const updateProductService = new UpdateProductService();

      const product = await updateProductService.execute({
        ...productData,
        imagem: imageFile?.buffer,
      });

      return res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

export { UpdateProductController };
