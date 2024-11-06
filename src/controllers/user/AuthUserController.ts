import { Request, Response, NextFunction } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj, categoria, code } = req.body;

    const authUserService = new AuthUserService();

    try {
      const authResponse = await authUserService.execute({
        cnpj,
        categoria,
        code,
      });
      console.log(authResponse);
      return res.json(authResponse);
    } catch (error) {
      next(error);
    }
  }
}

export { AuthUserController };
