import { AppError } from "../../../Errors/appError";
import prismaClient from "../../../prisma";
import { CatCliente } from "@prisma/client";

interface UserRequest {
  cnpj_rep: string;
  cnpj_marca: string;
  razao_social: string;
}

class BrandRegisterService {
  async execute({ cnpj_rep, cnpj_marca, razao_social }: UserRequest) {
    try {
      const repVerify = await prismaClient.representante.findFirst({
        where: {
          cnpj: cnpj_rep,
        },
      });

      if (!repVerify) {
        throw new AppError("O representante não foi encontrado", 401);
      }

      // Verifica se a marca já existe
      const marcaVerify = await prismaClient.marca.findUnique({
        where: {
          cnpj: cnpj_marca,
        },
      });

      if (!marcaVerify) {
        // Se a marca não existir, cria uma nova marca
        const newMarca = await prismaClient.marca.create({
          data: {
            cnpj: cnpj_marca,
            razao_social: razao_social,
          },
        });

        // Cria a associação inicial com a categoria P
        await prismaClient.representanteMarca.create({
          data: {
            cnpjMarca: cnpj_marca,
            cnpjRepresentante: cnpj_rep,
            categoria_representante: CatCliente.P,
          },
        });

        return newMarca;
      }

      // Verifica se o representante já está associado à marca
      const representanteExistente =
        await prismaClient.representanteMarca.findFirst({
          where: {
            cnpjMarca: cnpj_marca,
            cnpjRepresentante: cnpj_rep,
          },
        });

      if (representanteExistente) {
        throw new AppError(
          "Este representante já está associado a esta marca.",
          400
        );
      }

      // Verifica se já existem representantes associados nas três categorias
      const representantes = await prismaClient.representanteMarca.findMany({
        where: {
          cnpjMarca: cnpj_marca,
        },
      });

      const categoriasAssociadas = new Set(
        representantes.map((rep) => rep.categoria_representante)
      );

      if (
        categoriasAssociadas.has(CatCliente.P) &&
        categoriasAssociadas.has(CatCliente.M) &&
        categoriasAssociadas.has(CatCliente.G)
      ) {
        throw new AppError(
          "Já existem representantes associados à marca nas três categorias.",
          400
        );
      }

      // Define a próxima categoria a ser associada
      let proximaCategoria: CatCliente;
      if (!categoriasAssociadas.has(CatCliente.P)) {
        proximaCategoria = CatCliente.P;
      } else if (!categoriasAssociadas.has(CatCliente.M)) {
        proximaCategoria = CatCliente.M;
      } else {
        proximaCategoria = CatCliente.G;
      }

      // Cria a associação entre representante e marca com a próxima categoria
      await prismaClient.representanteMarca.create({
        data: {
          cnpjMarca: cnpj_marca,
          cnpjRepresentante: cnpj_rep,
          categoria_representante: proximaCategoria,
        },
      });

      return marcaVerify;
    } catch (error) {
      throw new AppError(`Erro ao registrar marca: ${error}`, 500);
    }
  }
}

export { BrandRegisterService };
