import { Request, Response, response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { categoria, cnpj, password, razao_social, email, receita_bruta } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      categoria,
      razao_social,
      cnpj,
      email,
      password,
      receita_bruta,
    });

    return res.status(201);
  }
}

export { CreateUserController };
