import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

cron.schedule('*/2 * * * *', async () => {
  try {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutos atrás

    const deletedRecords = await prisma.autenticacaoLogin.deleteMany({
      where: {
        data_criacao: {
          lt: twoMinutesAgo,
        },
      },
    });
  } catch(error){
    console.log(error);
  }
});
