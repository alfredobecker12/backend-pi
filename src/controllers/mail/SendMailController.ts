import { Request, Response, NextFunction } from 'express';
import { SendMailService } from '../../services/mail/SendMailService';

class SendMailController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id_pedido } = req.body;

        const sendMailService = new SendMailService();

        try {
            await sendMailService.execute({ id_pedido });

            return res.status(200).json({ message: 'Email enviado com sucesso' });
        
        } catch (error) {
            next(error);
        }
    }
}

export { SendMailController };
