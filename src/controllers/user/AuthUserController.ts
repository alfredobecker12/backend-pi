import { Request, Response, NextFunction } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
<<<<<<< HEAD
    const { cnpj, category, code } = req.body;

    const authUserService = new AuthUserService();

    try {
      const authResponse = await authUserService.execute({
        cnpj,
        category,
        code,
      });
      console.log(authResponse);
      return res.json(authResponse);
    
    } catch (error) {
      next(error); 
    }
=======
    const { cnpj, password } = req.body;
    
    const authUserService = new AuthUserService();

    try {
      const auth = await authUserService.execute({
        cnpj,
        password,
      });
      console.log(auth)
      return res.json(auth);
    
    } catch (error) {
      next(error);
    }
    
>>>>>>> 014f516583484c0bbdbc23fc85e5d700bd1c59e5
  }
}

export { AuthUserController };
