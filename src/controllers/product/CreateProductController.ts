import { Request, Response, NextFunction } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";
import multer from "multer";

interface MulterRequest extends Request {
  file?: multer.File;
}

class CreateProductController {
  async handle(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const productData = JSON.parse(req.body.data);
      const imageFile = req.file;

      const createProductService = new CreateProductService();

      const product = await createProductService.execute({
        ...productData,
        imagem: imageFile?.buffer,
      });

      return res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

export { CreateProductController };
