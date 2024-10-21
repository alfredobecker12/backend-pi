import prismaClient from '../../prisma';
import { AppError } from '../../Errors/appError';
import { transporter } from '../../middlewares/mailConfig';

interface UserData {
    cnpj: string;
    email: string;
}

class SendAuthService {
    async execute({ cnpj, email }: UserData) {
        const authCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        try {
            const userData = await prismaClient.cliente.findFirst({
                where: { cnpj }
            }) || await prismaClient.representante.findFirst({
                where: { cnpj }
            });

            if (!userData) {
                throw new AppError('CNPJ não cadastrado', 404);
            }

            if (email !== userData.email) {
                throw new AppError('Email cadastrado não encontrado', 404);
            }

            await transporter.sendMail({
                from: {
                    name: 'Repnet',
                    address: process.env.USER
                },
                to: email,
                subject: 'Código de Autenticação',
                text: `Seu código de autenticação é ${authCode}. Você tem no máximo 5 minutos para utilizá-lo.`
            });

            const authCodeAlredyExists = await prismaClient.autenticacaoLogin.findFirst({
                where: {
                    email: email
                }
            });

            if(authCodeAlredyExists) {
                await prismaClient.autenticacaoLogin.delete({
                    where: {
                        id: authCodeAlredyExists.id
                    }
                });
            }

            await prismaClient.autenticacaoLogin.create({
                data: {
                    email,
                    codigo: authCode,
                },
            });

        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new AppError('Erro ao enviar email', 500);
        }
    }
}

export { SendAuthService };
