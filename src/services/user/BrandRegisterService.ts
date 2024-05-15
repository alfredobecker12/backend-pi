import prismaClient from "../../prisma";
import { CatCliente } from "@prisma/client";

interface UserRequest {
    cnpj_rep: string;
    cnpj_marca: string;
    razao_social: string;
};

class BrandRegisterService {
    async execute({cnpj_rep, cnpj_marca, razao_social}: UserRequest) {
        const marcaVerify = await prismaClient.marca.findUnique({ // Verifica se existe a marca
            where: {
                cnpj: cnpj_marca
            },
        });

        if (marcaVerify) {
            const representantes = await prismaClient.representanteMarca.findMany({ // Encontra os representantes associados à marca
                where: {
                    cnpjMarca: cnpj_marca,
                },
            });

            const categoriasAssociadas = new Set(representantes.map(rep => rep.categoria_representante));

            // Verifica se já existem representantes de todas as categorias associados à marca
            if (categoriasAssociadas.has('P') && categoriasAssociadas.has('M') && categoriasAssociadas.has('G')) {
                throw new Error("Já existem representantes associados à marca nas três categorias.");
            }

            // Define a próxima categoria a ser associada
            let proximaCategoria: CatCliente;
            if (!categoriasAssociadas.has('P')) {
                proximaCategoria = CatCliente.P;
            } else if (!categoriasAssociadas.has('M')) {
                proximaCategoria = CatCliente.M;
            } else {
                proximaCategoria = CatCliente.G;
            }

            // Cria a associação entre representante e marca com a próxima categoria
            const newMarcaRep = await prismaClient.representanteMarca.create({
                data: {
                    cnpjMarca: cnpj_marca,
                    cnpjRepresentante: cnpj_rep,
                    categoria_representante: proximaCategoria,
                }
            });

            return marcaVerify;
        } else {
            const newMarca = await prismaClient.marca.create({
                data: {
                    cnpj: cnpj_marca,
                    razao_social: razao_social,
                }
            });

            // Cria a associação entre representante e marca com a categoria P
            const newMarcaRep = await prismaClient.representanteMarca.create({
                data: {
                    cnpjMarca: cnpj_marca,
                    cnpjRepresentante: cnpj_rep,
                    categoria_representante: CatCliente.P,
                }
            });

            return newMarca
        }
    }
}

export { BrandRegisterService };
