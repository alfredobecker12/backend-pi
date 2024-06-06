import { Request, Response, NextFunction } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { categoria, cnpj, password, razao_social, email, receita_bruta } = req.body;

    const createUserService = new CreateUserService();

    try {
      const user = await createUserService.execute({
        categoria,
        razao_social,
        cnpj,
        email,
        password,
        receita_bruta,
      });

      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export { CreateUserController };
