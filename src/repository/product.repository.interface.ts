import { CreateProductRequestDTO } from "../dtos/create-product.dto";
import { UpdateProductRequestDTO } from "../dtos/update-product.dto";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";

export interface ProductRepository {
  create(product: CreateProductRequestDTO): Promise<Product | null>;
  update(product: UpdateProductRequestDTO): Promise<Product | null>;
  remove(productId: number): Promise<number | null | undefined>;
  findById(productId: number): Promise<Product | null>;
  findByName(name: string, categoryId: number): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Category | null>;
}
