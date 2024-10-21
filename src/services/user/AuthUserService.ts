import prismaClient from "../../prisma";
<<<<<<< HEAD
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
    if (category === 'C') {
      userInfo = await prismaClient.cliente.findFirst({
        where: { cnpj }
      });
    
    } else if (category === 'R') {
      userInfo = await prismaClient.representante.findFirst({
        where: { cnpj }
      });
    
    } else {
      throw new AppError("Categoria inválida", 400);
    }

    if (!userInfo) {
      throw new AppError("CNPJ não cadastrado", 404);
    }

    const authCode = await prismaClient.autenticacaoLogin.findFirst({
      where: { email: userInfo.email }
    });

    if (!authCode) {
      throw new AppError("Código não registrado", 404);
    }

    if (authCode.codigo !== code) {
      throw new AppError("Código incorreto", 400);
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
      cnpj: userInfo.cnpj,
      categoria: category,
      email: userInfo.email,
      token: token,
    };
=======
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from "../../Errors/appError";

interface AuthRequest {
  cnpj: string;
  password: string;
}

class AuthUserService {
  async execute({ cnpj, password }: AuthRequest) {
    const cnpjTable = await prismaClient.cliente.findFirst({
      where: { cnpj }
    });

    if (cnpjTable) {
      const infoClient = await prismaClient.cliente.findFirst({
        where: { cnpj }
      });
      const passwordCliente = await prismaClient.login.findFirst({
        where: { id: infoClient.id_log }
      });

      const passwordMatch = await compare(password, passwordCliente.password);

      if (!passwordMatch) {
        throw new AppError("Usuário ou senha incorreto", 401);
      }

      const token = sign(
        {
          cnpj: infoClient.cnpj,
          email: infoClient.email,
        },
        process.env.JWT_SECRET,
        {
          subject: infoClient.cnpj,
          expiresIn: "30d",
        }
      );

      return {
        cnpj: infoClient.cnpj,
        categoria: 'C',
        email: infoClient.email,
        token: token,
      };

    } else {
      const infoRepresentante = await prismaClient.representante.findFirst({
        where: { cnpj }
      });

      if (!infoRepresentante) {
        throw new AppError("CNPJ não cadastrado", 404);
      }

      const passwordRepresentante = await prismaClient.login.findFirst({
        where: { id: infoRepresentante.id_log }
      });

      const passwordMatch = await compare(password, passwordRepresentante.password);

      if (!passwordMatch) {
        throw new AppError("Usuário ou senha incorreto", 400);
      }

      const token = sign(
        {
          cnpj: infoRepresentante.cnpj,
          email: infoRepresentante.email,
        },
        process.env.JWT_SECRET,
        {
          subject: infoRepresentante.cnpj,
          expiresIn: "30d",
        }
      );

      return {
        cnpj: infoRepresentante.cnpj,
        categoria: 'R',
        email: infoRepresentante.email,
        token: token,
      };
    }
>>>>>>> 014f516583484c0bbdbc23fc85e5d700bd1c59e5
  }
}

export { AuthUserService };
