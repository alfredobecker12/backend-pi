import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { AppError } from "../../Errors/appError";

interface UserData {
  cnpj: string;
  password: string;
}

class LoginUserService {
  async execute({ cnpj, password }: UserData) {
    // Tenta encontrar o cliente pelo CNPJ
    const cliente = await prismaClient.cliente.findFirst({
      where: { cnpj },
    });

    if (cliente) {
      const passwordCliente = await prismaClient.login.findFirst({
        where: { id: cliente.id_log },
      });

      const passwordMatch = await compare(password, passwordCliente.password);

      if (!passwordMatch) {
        throw new AppError("Usuário ou senha incorreto", 401);
      }

      // Aqui você pode retornar o token ou outros dados, se necessário
      return {
        cnpj: cliente.cnpj,
        categoria: "C",
        email: cliente.email,
        // token: gerado aqui se necessário
      };
    }

    // Se não encontrou como cliente, tenta como representante
    const representante = await prismaClient.representante.findFirst({
      where: { cnpj },
    });

    if (!representante) {
      throw new AppError("CNPJ não cadastrado", 404);
    }

    const passwordRepresentante = await prismaClient.login.findFirst({
      where: { id: representante.id_log },
    });

    const passwordMatchRepresentante = await compare(
      password,
      passwordRepresentante.password
    );

    if (!passwordMatchRepresentante) {
      throw new AppError("Usuário ou senha incorreto", 400);
    }

    // Aqui você pode retornar o token ou outros dados, se necessário
    return {
      cnpj: representante.cnpj,
      categoria: "R",
      email: representante.email,
      // token: gerado aqui se necessário
    };
  }
}

export { LoginUserService };
