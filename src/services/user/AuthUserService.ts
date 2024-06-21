import prismaClient from "../../prisma";
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
        throw new AppError("Senha incorreta", 401);
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
        throw new AppError("Senha incorreta", 401);
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
  }
}

export { AuthUserService };
