import { Request, Response, response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { categoria, cnpj, password, razao_social, email } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      categoria,
      razao_social,
      cnpj,
      email,
      password,
    });

    return res.json(user);
  }
}

export { CreateUserController };
