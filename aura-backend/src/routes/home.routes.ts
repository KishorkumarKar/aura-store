import { Router } from "express";
import { homeController } from "../controllers/home.controller";
import { productController } from "../controllers/product.controller";

const categoryRouter = Router();
categoryRouter.get("/", productController.categories);

const bannerRouter = Router();
bannerRouter.get("/", homeController.banners);

const featureRouter = Router();
featureRouter.get("/", homeController.features);

const homeRouter = Router();
homeRouter.get("/", homeController.home);
homeRouter.get("/featured-products", homeController.featured);

export { categoryRouter, bannerRouter, featureRouter, homeRouter };
