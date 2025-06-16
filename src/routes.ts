import { Router } from "express";
import multer from "multer";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductController } from "./controllers/product/ListProductController";
import { BrandRegisterController } from "./controllers/product/details/BrandRegisterController";
import { NewOrderController } from "./controllers/order/NewOrderController";
import { NewCategoryController } from "./controllers/product/details/NewCategoryController";
import { ListOrderController } from "./controllers/order/ListOrderController";
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { ListCategoryController } from "./controllers/product/details/ListCategorysController";
import { ListBrandController } from "./controllers/product/details/ListBrandController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { LoginUserController } from "./controllers/user/LoginUserController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { OrderReportController } from "./controllers/order/OrderReportController";
import { UpdateProductController } from "./controllers/product/UpdateProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { GetProductByIdController } from "./controllers/product/GetProductByIdController";

const router = Router();
const upload = multer();

//-- ROTAS USER --
router.post("/cadastro", new CreateUserController().handle);
router.post("/login", new LoginUserController().handle); // Verifica as credenciasi
router.post("/autenticar", new AuthUserController().handle); // Verifica o código e retorna o token
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/cadastro-produto", upload.single("image"), new CreateProductController().handle);
router.patch("/atualizar-produto", upload.single("image"), new UpdateProductController().handle);
router.put("/deletar-produto", new DeleteProductController().handle);
router.post("/cadastro-categoria", new NewCategoryController().handle);
router.get("/produtos", new ListProductController().handle);
router.get("/produtos/id", new GetProductByIdController().handle);
router.post("/cadastro-marca", new BrandRegisterController().handle);
router.post("/cadastro-pedido", new NewOrderController().handle);
router.post("/pedidos", new ListOrderController().handle);
router.patch("/perfil/atualizar", new UpdateUserController().handle);
router.get("/categorias", new ListCategoryController().handle);
router.get("/marcas", new ListBrandController().handle);
router.post("/enviar-pedido", new SendOrderController().handle);
router.post("/resumo-pedidos", new DetailOrderController().handle);
router.post("/relatorio", new OrderReportController().handle);

export { router };
