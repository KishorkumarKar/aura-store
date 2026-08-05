import { AppDataSource } from "../config/data-source";
import { Banner } from "../entities/Banner";
import { Feature } from "../entities/Feature";
import { Product } from "../entities/Product";
import { productService, serializeProduct } from "./product.service";

export const homeService = {
  async listBanners() {
    const repo = AppDataSource.getRepository(Banner);
    return repo.find({
      where: { isActive: true },
      order: { sortOrder: "ASC" },
    });
  },

  async listFeatures() {
    const repo = AppDataSource.getRepository(Feature);
    return repo.find({ order: { sortOrder: "ASC" } });
  },

  async getFeaturedProducts(limit = 4) {
    const repo = AppDataSource.getRepository(Product);
    const products = await repo.find({
      relations: { category: true, variants: true },
      order: { createdAt: "DESC" },
      take: limit,
    });
    return products.map(serializeProduct);
  },

  // Convenience aggregate for the homepage — saves the client four
  // separate round trips on first paint.
  async getHomePayload() {
    const [banners, categories, features, featuredProducts] = await Promise.all([
      this.listBanners(),
      productService.listCategories(),
      this.listFeatures(),
      this.getFeaturedProducts(),
    ]);
    return { banners, categories, features, featuredProducts };
  },
};
