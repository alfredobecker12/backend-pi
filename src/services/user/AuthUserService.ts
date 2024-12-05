import prismaClient from "../../prisma";
import { AppError } from "../../Errors/appError";
import { sign } from "jsonwebtoken";
import { Cliente, Representante } from "@prisma/client";

interface AuthRequest {
  cnpj: string;
  categoria: string;
  code: number;
}

class AuthUserService {
  async execute({ cnpj, categoria, code }: AuthRequest) {
    let userInfo: Cliente | Representante | null;

    if (categoria == "C") {
      userInfo = await prismaClient.cliente.findFirst({
        where: { cnpj },
      });
    } else if (categoria == "R") {
      userInfo = await prismaClient.representante.findFirst({
        where: { cnpj },
      });
    } else {
      throw new AppError("Categoria inválida", 400);
    }

    if (!userInfo) {
      throw new AppError("CNPJ não cadastrado", 404);
    }

    const authCode = await prismaClient.autenticacaoLogin.findFirst({
      where: {
        email: userInfo.email,
      },
    });

    if (!authCode) {
      throw new AppError("Código não registrado", 404);
    }

    if (authCode.codigo !== code) {
      throw new AppError("Código incorreto", 400);
    }

    if(authCode.codigo == code){
      await prismaClient.autenticacaoLogin.delete({
        where: {
          id: authCode.id,
        },
      });
    }

    const token = sign(
      {
        cnpj: userInfo.cnpj,
        email: userInfo.email,
      },
      process.env.JWT_SECRET,
      {
        subject: userInfo.cnpj,
        expiresIn: "30d",
      }
    );

    return {
      razao_social: userInfo.razao_social,
      cnpj: userInfo.cnpj,
      categoria: categoria,
      email: userInfo.email,
      token: token,
    };
  }
}

export { AuthUserService };
