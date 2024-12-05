import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes";
import { errorHandler } from "./middlewares/ErrorHandles";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandler);

// Middleware para lidar com erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(3333, () => console.log("servidor online!!"));
