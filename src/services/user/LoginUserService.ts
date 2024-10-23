import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { AppError } from "../../Errors/appError";
import MailSender from "../mail/MailSender";
import { AutenticacaoLogin } from "@prisma/client";

interface UserData {
  cnpj: string;
  password: string;
}

class LoginUserService {
  async execute({ cnpj, password }: UserData) {
    // Validação básica
    if (!cnpj || !password) {
      throw new AppError("CNPJ e senha são obrigatórios", 400);
    }

    // Função para criação e envio do código de autenticação
    const createAndSendAuthCode = async (email: string, authCode: number, subject: string, text: string) => {
      let authCodeRegistered: AutenticacaoLogin;
      
      try {
          authCodeRegistered = await prismaClient.autenticacaoLogin.findFirst({
          where: {
            email: email
          }
        });

      } catch (error) {
        throw new AppError(`Erro ao consultar existência do código: ${error}`, 500);
      }
      
      if(authCodeRegistered) {
          
        try {
          await prismaClient.autenticacaoLogin.delete({
            where: {
              id: authCodeRegistered.id
            }
          });
        
        } catch (error) {
          throw new AppError(`Erro ao excluir registro de código exixtente: ${error}`, 500);
        }
      }
      
      try {
        await prismaClient.autenticacaoLogin.create({
          data: { email, codigo: authCode }
        });
        await MailSender.sendMail(email, subject, text);
      
      } catch (error) {
        throw new AppError(`Erro ao criar código de autenticação ou enviar email: ${error.message}`, 500);
      }
    };

    // Geração do código de autenticação
    const authCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const subject = "Código de autenticação";
    const text = `O seu código de autenticação é ${authCode}. Você tem 2 minutos para usá-lo.`;

    // Tenta encontrar o cliente pelo CNPJ
    const cliente = await prismaClient.cliente.findFirst({ where: { cnpj } });

    if (cliente) {
      const passwordCliente = await prismaClient.login.findFirst({
        where: { id: cliente.id_log },
      });

      if (!passwordCliente) {
        throw new AppError("Usuário ou senha incorreto", 401);
      }

      const passwordMatch = await compare(password, passwordCliente.password);
      if (!passwordMatch) {
        throw new AppError("Usuário ou senha incorreto", 401);
      }

      // Criar e enviar código para o cliente
      await createAndSendAuthCode(cliente.email, authCode, subject, text);

      return {
        cnpj: cliente.cnpj,
        categoria: "C",
        email: cliente.email,
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

    if (!passwordRepresentante) {
      throw new AppError("Usuário ou senha incorreto", 401);
    }

    const passwordMatchRepresentante = await compare(password, passwordRepresentante.password);
    if (!passwordMatchRepresentante) {
      throw new AppError("Usuário ou senha incorreto", 400);
    }

    // Criar e enviar código para o representante
    await createAndSendAuthCode(representante.email, authCode, subject, text);

    return {
      cnpj: representante.cnpj,
      categoria: "R",
      email: representante.email,
    };
  }
}

export { LoginUserService };
