import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProductController } from "./controllers/user/CreateProductControll";
import { ListProductController } from "./controllers/user/ListProductController";

const router = Router();

//-- ROTAS USER --
router.post("/cadastro", new CreateUserController().handle);
router.get("/login", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/cadastro-produto", new CreateProductController().handle);
router.get("/produtos", new ListProductController().handle);

export { router };
