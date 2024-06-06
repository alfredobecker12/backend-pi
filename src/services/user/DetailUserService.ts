import prismaClient from "../../prisma";

class DetailUserService {
  async execute(cnpj: string) {
    const clientTable = await prismaClient.cliente.findFirst({
      where: {
        cnpj: cnpj,
      },
    });
    
    if (clientTable) { // SE FOR CLIENTE
      return {
        cnpj: cnpj,
        categoria: "C",
        razao_social: clientTable.razao_social,
        email: clientTable.email
      }
    
    } else { //SE FOR REPRESENTANTE
      const representateTable = await prismaClient.representante.findFirst({
        where: {
          cnpj: cnpj
        }
      });
      
      return {
        cnpj: cnpj,
        categoria: "R",
        razao_social: representateTable.razao_social,
        email: representateTable.email
      }
    }
  }
}

export { DetailUserService };
