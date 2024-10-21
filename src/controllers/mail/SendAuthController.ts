import { Request, Response, NextFunction } from 'express';
import { SendAuthService } from '../../services/mail/SendAuthService';

class SendAuthController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { cnpj, email } = req.body;

        const sendAuthService = new SendAuthService();

        try {
            await sendAuthService.execute({ cnpj, email });
            return res.status(200).json({ message: 'Email enviado com sucesso' });
        
        } catch (error) {
            next(error);
        }
    }
}

export { SendAuthController };
