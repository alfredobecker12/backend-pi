import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
import { StatusUser } from "@prisma/client";
import { CatCliente } from "@prisma/client";
import { AppError } from "../../Errors/appError";

interface UserRequest {
  categoria: string;
  razao_social: string;
  cnpj: string;
  email: string;
  password: string;
  receita_bruta?: number; // receita_bruta deve ser opcional, pois nem todos os usuários têm esse campo
}

class CreateUserService {

  async execute({ categoria, razao_social, cnpj, email, password, receita_bruta }: UserRequest) {
    try {
      
      if (!categoria || !razao_social || !cnpj || !email || !password) {
        throw new AppError("Preencha os campos obrigatórios", 400);
      }

      const passwordHash = await hash(password, 8);

      if (categoria === 'C') {
        
        if (!receita_bruta || receita_bruta < 0) {
          throw new AppError("Preencha o campo de receita bruta com um valor válido", 400);
        }

        const cnpjAlreadyExists = await prismaClient.cliente.findFirst({
          where: {
            cnpj: cnpj,
          },
        });

        if (cnpjAlreadyExists) {
          throw new AppError("CNPJ já cadastrado", 500);
        }

        let clientSize: CatCliente;
        
        if (receita_bruta < 10000) {
          clientSize = CatCliente.P;
        } else if (receita_bruta >= 10000 && receita_bruta < 50000) {
          clientSize = CatCliente.M;
        } else {
          clientSize = CatCliente.G;
        }

        const userPassword = await prismaClient.login.create({
          data: {
            password: passwordHash,
          },
          select: {
            id: true,
            password: true,
          },
        });

        const user = await prismaClient.cliente.create({
          data: {
            cnpj: cnpj,
            razao_social: razao_social,
            status: StatusUser.ATIVO,
            email: email,
            receita_bruta: receita_bruta,
            categoria_cliente: clientSize,
            id_log: userPassword.id,
          },
          select: {
            cnpj: true,
            razao_social: true,
            email: true,
          },
        });

        return user;

      } else { // Representante
        const cnpjAlreadyExists = await prismaClient.representante.findFirst({
          where: {
            cnpj: cnpj,
          },
        });

        if (cnpjAlreadyExists) {
          throw new AppError("CNPJ já cadastrado", 500);
        }

        const userPassword = await prismaClient.login.create({
          data: {
            password: passwordHash,
          },
          select: {
            id: true,
            password: true,
          },
        });

        const user = await prismaClient.representante.create({
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
      }
    
    } catch (error) {
      
      if (error instanceof AppError) {
        throw error;
      
      } else {
        throw new AppError("Erro interno do servidor", 500);
      }
    }
  }
}

export { CreateUserService };
