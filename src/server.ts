import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes";
import { errorHandler } from "./middlewares/ErrorHandles";

const app = express();

const allowedOrigins = ['https://repnet.tec.br', 'https://frontend-repnet.vercel.app', 'http://localhost:3000'];

app.use(express.json());
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Verifica se a origem está na lista de origens permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Permitir credenciais
};

app.use(cors(corsOptions));
app.use(router);
app.use(errorHandler);

// Middleware para lidar com erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(3333, '0.0.0.0', () => console.log("Servidor online!!"));
