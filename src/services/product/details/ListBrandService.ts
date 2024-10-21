import { AppError } from "../../../Errors/appError";
import prismaClient from "../../../prisma";

class ListBrandService {
    async execute() {

        try {
            const brands = await prismaClient.marca.findMany();

            if(!brands) {
                throw new AppError("Não foram encontradas marcas registras", 404);
            
            } else {
                return brands;
            }
            
        } catch(error) {

            if(error instanceof AppError) {
                throw error;
            
            }else {
                throw new AppError(`Erro ao buscar as marcas: ${error}`, 500);
            }
        }

    }
}

export { ListBrandService };
