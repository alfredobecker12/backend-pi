import prismaClient from "../../prisma";
import { AppError } from "../../Errors/appError";
import { sign } from "jsonwebtoken";
import { Cliente, Representante } from "@prisma/client";

interface AuthRequest {
  cnpj: string;
  category: string;
  code: number;
}

class AuthUserService {
  async execute({ cnpj, category, code }: AuthRequest) {
    let userInfo: Cliente | Representante | null;

    // Verifica se a categoria é 'C' (Cliente) ou 'R' (Representante)
    if (category === "C") {
      userInfo = await prismaClient.cliente.findFirst({
        where: { cnpj },
      });
    } else if (category === "R") {
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
      where: { email: userInfo.email },
    });

    if (!authCode) {
      throw new AppError("Código não registrado", 404);
    }

    if (authCode.codigo !== code) {
      throw new AppError("Código incorreto", 400);
    }

    await prismaClient.autenticacaoLogin.delete({
      where: {
        id: authCode.id,
      },
    });

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
      cnpj: userInfo.cnpj,
      categoria: category,
      email: userInfo.email,
      token: token,
    };
  }
}

export { AuthUserService };
