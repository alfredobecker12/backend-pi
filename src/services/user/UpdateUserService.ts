import { AppError } from "../../Errors/appError";
import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  cnpj: string;
  razao_social: string;
  email: string;
  password?: string;
}

class UpdateUserService {
  async execute({ cnpj, razao_social, email, password }: UserRequest) {
    if (!cnpj || !razao_social || !email) {
      throw new AppError(
        "Todos os campos obrigatórios devem ser preenchidos.",
        400
      );
    }

    try {
      const userTypeVerification = await prismaClient.cliente.findFirst({
        where: {
          cnpj: cnpj,
        },
      });

      let updatedObject: any;

      if (userTypeVerification) {
        updatedObject = await prismaClient.cliente.update({
          where: {
            cnpj: cnpj,
          },
          data: {
            razao_social: razao_social,
            email: email,
          },
        });
      } else {
        updatedObject = await prismaClient.representante.findFirst({
          where: {
            cnpj: cnpj,
          },
        });

        if (!updatedObject) {
          throw new AppError("Usuário não encontrado.", 404);
        }

        updatedObject = await prismaClient.representante.update({
          where: {
            cnpj: cnpj,
          },
          data: {
            razao_social: razao_social,
            email: email,
          },
        });
      }

      if (password) {
        const passwordHash = await hash(password, 8);
        await prismaClient.login.update({
          where: {
            id: updatedObject.id_log,
          },
          data: {
            password: passwordHash,
          },
        });
      }

      return {
        cnpj,
        razao_social,
        email,
      };
    } catch (error) {
      throw new AppError(`Erro ao atualizar usuário: ${error}`, 500);
    }
  }
}

export { UpdateUserService };
