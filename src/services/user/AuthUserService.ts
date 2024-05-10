import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  cnpj: string;
  password: string;
}

class AuthUserService {
  async execute({ cnpj, password }: AuthRequest) {

    const cnpjTable = await prismaClient.cliente.findFirst({
      where: {
        cnpj: cnpj,
      }
    });

    if (cnpjTable) { // Se for cliente
      const infoClient = await prismaClient.cliente.findFirst({
        where: {
          cnpj: cnpj,
        },
      });
      const passwordCliente = await prismaClient.login.findFirst({
          where: {
            id: infoClient.id_log,
          }
        });

      // Verifica se a senha que ele mandou está correta.
      const passwordMatch = await compare(password, passwordCliente.password);

      if (!passwordMatch) {
        throw new Error("Usuário ou senha incorreto");
      }

      // Se passou das validações gera o token pro usuario
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
    
    
    } else { // SE FOR REPRESENTANTE
      const infoRepresentante = await prismaClient.representante.findFirst({
        where: {
          cnpj: cnpj,
        },
      });
      console.log("to aqui")
      const passwordRepresentante = await prismaClient.login.findFirst({
          where: {
            id: infoRepresentante.id_log,
          }
        });
      console.log("To ali")
      // Verifica se a senha que ele mandou está correta.
      const passwordMatch = await compare(password, passwordRepresentante.password);

      if (!passwordMatch) {
        throw new Error("Usuário ou senha incorreto");
      }

      // Se passou das validações gera o token pro usuario
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
