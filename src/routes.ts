import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProductController } from "./controllers/user/CreateProductControll";
import { ListProductController } from "./controllers/user/ListProductController";
import { BrandRegisterController } from "./controllers/user/BrandRegisterController";
import { NewOrderController } from "./controllers/user/NewOrderController";
import { NewCategoryController } from "./controllers/user/NewCategoryController";
import { ListOrderController } from "./controllers/user/ListOrderController";

const router = Router();

//-- ROTAS USER --
router.post("/cadastro", new CreateUserController().handle);
router.get("/login", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/cadastro-produto", new CreateProductController().handle);
router.post("/cadastro-categoria", new NewCategoryController().handle);
router.get("/produtos", new ListProductController().handle);
router.post("/cadastro-marca", new BrandRegisterController().handle);
router.post("/cadastro-pedido", new NewOrderController().handle);
router.get("/pedidos", new ListOrderController().handle);

export { router };
