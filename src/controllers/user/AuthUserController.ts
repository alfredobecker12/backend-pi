import { Request, Response, NextFunction } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { cnpj, password } = req.body;

    const authUserService = new AuthUserService();
    
    try {
      const auth = await authUserService.execute({ cnpj, password });
      return res.json(auth);
    
    } catch(error) {
      next(error); 
    }
  }
}

export { AuthUserController };
