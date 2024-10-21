import { Request, Response, NextFunction } from "express";
import { LoginUserService } from "../../services/user/LoginUserService";

class LoginUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj, password } = req.body;

    const loginUserService = new LoginUserService();

    try {
      console.log("rota correta !!");
      const loginResponse = await loginUserService.execute({
        cnpj,
        password,
      });
      console.log(loginResponse);
      return res.json(loginResponse);
    } catch (error) {
      next(error);
    }
  }
}

export { LoginUserController };
