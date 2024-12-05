import { Request, Response, NextFunction } from "express";
import { LoginUserService } from "../../services/user/LoginUserService";

class LoginUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj, password } = req.body;

    const loginUserService = new LoginUserService();

    try {
      const loginResponse = await loginUserService.execute({
        cnpj,
        password,
      });
      return res.json(loginResponse);
    } catch (error) {
      next(error);
    }
  }
}

export { LoginUserController };
