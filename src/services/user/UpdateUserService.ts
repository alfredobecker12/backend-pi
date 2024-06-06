import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
    cnpj: string,
    razao_social: string,
    email: string,
    password: string
}

class UpdateUserService {
    async execute({ cnpj, razao_social, email, password }: UserRequest) {
        
        if (!cnpj || !razao_social || !email || !password) {
            throw new AppError("Todos os campos devem ser preenchidos.", 400);
        }

        try {
            const passwordHash = await hash(password, 8);
            
            const userTypeVerfification = await prismaClient.cliente.findFirst({
                where: {
                    cnpj: cnpj
                }
            });

            let updatedObject;
            if (userTypeVerfification) {
                updatedObject = await prismaClient.cliente.update({
                    where: {
                        cnpj: cnpj
                    },
                    data: {
                        razao_social: razao_social,
                        email: email
                    }
                });
            } else {
                updatedObject = await prismaClient.representante.update({
                    where: {
                        cnpj: cnpj
                    },
                    data: {
                        razao_social: razao_social,
                        email: email
                    }
                });
            }

            await prismaClient.login.update({
                where: {
                    id: updatedObject.id_log
                },
                data: {
                    password: passwordHash
                }
            });

            return {
                cnpj,
                razao_social,
                email
            };
        
        } catch (error) {
            throw new AppError("Erro ao atualizar usuário", 500);
        }
    }
}

export { UpdateUserService };
