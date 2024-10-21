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
import { SendOrderController } from "./controllers/mail/SendOrderController";
<<<<<<< HEAD
import { SendAuthController } from "./controllers/mail/SendAuthController";
import { LoginUserController } from "./controllers/user/LoginUserController";
=======
>>>>>>> 014f516583484c0bbdbc23fc85e5d700bd1c59e5

const router = Router();

//-- ROTAS USER --
router.post("/cadastro", new CreateUserController().handle);
<<<<<<< HEAD
router.post("/login", new LoginUserController().handle); // Verifica as credenciasi
router.post("/autenticar", new SendAuthController().handle); // Verifica o email e manda o código
router.post("/autenticar-login", new AuthUserController().handle); // Verifica o código e retorna o token
=======
router.post("/login", new AuthUserController().handle);
>>>>>>> 014f516583484c0bbdbc23fc85e5d700bd1c59e5
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/cadastro-produto", new CreateProductController().handle);
router.post("/cadastro-categoria", new NewCategoryController().handle);
router.post("/produtos", new ListProductController().handle);
router.post("/cadastro-marca", new BrandRegisterController().handle);
router.post("/cadastro-pedido", new NewOrderController().handle);
router.get("/pedidos", new ListOrderController().handle);
router.patch("/perfil/atualizar", new UpdateUserController().handle);
router.get("/categorias", new ListCategoryController().handle); 
router.get("/marcas", new ListBrandController().handle);
router.post("/enviar-pedido", new SendOrderController().handle);

export { router };
