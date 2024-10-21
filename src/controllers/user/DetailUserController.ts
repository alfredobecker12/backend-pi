import { Request, Response, NextFunction } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.cnpj;
    
    const detailUserService = new DetailUserService();

    try {
      const user = await detailUserService.execute(cnpj);

      return res.json(user);
    
    } catch(error) {
      next(error)
    }
  }
}

export { DetailUserController };
