import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
  async handle(req: Request, res: Response) {
    const cnpj = req.cnpj;

    const detailUserService = new DetailUserService();

    const user = await detailUserService.execute(cnpj);

    return res.json(user);
  }
}

export { DetailUserController };
