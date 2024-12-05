import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
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

      console.log(`Deletados ${deletedRecords.count} registros antigos.`);
      res.status(200).json({ message: 'Registros antigos deletados com sucesso.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro ao deletar registros antigos.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
