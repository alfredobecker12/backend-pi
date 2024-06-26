import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProductController } from "./controllers/product/CreateProductControll";
import { ListProductController } from "./controllers/product/ListProductController";
import { BrandRegisterController } from "./controllers/product/details/BrandRegisterController";
import { NewOrderController } from "./controllers/order/NewOrderController";
import { NewCategoryController } from "./controllers/product/details/NewCategoryController";
import { ListOrderController } from "./controllers/order/ListOrderController";
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { ListCategoryController } from "./controllers/product/details/ListCategorysController";
import { ListBrandController } from "./controllers/product/details/ListBrandController";
import { SendMailController } from "./controllers/mail/SendMailController";

const router = Router();

//-- ROTAS USER --
router.post("/cadastro", new CreateUserController().handle);
router.post("/login", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/cadastro-produto", new CreateProductController().handle);
router.post("/cadastro-categoria", new NewCategoryController().handle);
router.get("/produtos", new ListProductController().handle);
router.post("/cadastro-marca", new BrandRegisterController().handle);
router.post("/cadastro-pedido", new NewOrderController().handle);
router.get("/pedidos", new ListOrderController().handle);
router.patch("/perfil/atualizar", new UpdateUserController().handle);
router.get("/categorias", new ListCategoryController().handle); 
router.get("/marcas", new ListBrandController().handle);
router.post("/enviar-pedido", new SendMailController().handle);

export { router };
