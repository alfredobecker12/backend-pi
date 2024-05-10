import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
import { StatusUser } from "@prisma/client";

interface UserRequest {
  categoria: string;
  razao_social: string;
  cnpj: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ categoria, razao_social, cnpj, email, password }: UserRequest) {
    // Verifica se ele enviou um email
    if (!email) {
      throw new Error("Email incorrect");
    }

    if (!razao_social) {
      throw new Error("Razão social incorrect");
    }

    // Verifica se ele enviou um cnpj
    if (!cnpj) {
      throw new Error("CNPJ incorrect");
    }

    // Verifica se o CNPJ já está cadastrado
    if (categoria == 'C') {
      const cnpjAlreadyExists = await prismaClient.cliente.findFirst({
        where: {
          cnpj: cnpj,
        },
      });
  
      if (cnpjAlreadyExists) {
        throw new Error("Este CNPJ já está cadastrado");
      }
  
      // Cria a senha
      const passwordHash = await hash(password, 8);
      
      const userPassword = await prismaClient.login.create({
        data: {
          password: passwordHash,
        },
        select: {
          id: true,
          password: true,
        },
      });

      // Cria o usuario
      const user = await prismaClient.cliente.create({
        data: {
          cnpj: cnpj,
          razao_social: razao_social,
          status: StatusUser.ATIVO,
          email: email,
          id_log: userPassword.id,
        },
        select: {
          cnpj: true,
          razao_social: true,
          email: true,
        },
      });
      
      return user;
    
    } else { // SE FOR REPRESENTANTE
      const cnpjAlreadyExists = await prismaClient.representante.findFirst({
        where: {
          cnpj: cnpj,
        },
      });
  
      if (cnpjAlreadyExists) {
        throw new Error("Este CNPJ já está cadastrado");
      }
  
      // Cria a senha
      const passwordHash = await hash(password, 8);
      
      const userPassword = await prismaClient.login.create({
        data: {
          password: passwordHash,
        },
        select: {
          id: true,
          password: true,
        },
      });

      // Cria o usuario
      const user = await prismaClient.representante.create({
        data: {
          cnpj: cnpj,
          razao_social: razao_social,
          status: StatusUser.ATIVO,
          email: email,
          id_log: userPassword.id
        },
        select: {
          cnpj: true,
          razao_social: true,
          email: true,
        },
      });
  
      return user;
    }
  }
}
    
export { CreateUserService };
