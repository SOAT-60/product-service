import { injectable } from "inversify";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product";
import { AppDataSource } from "../config";
import { CreateProductRequestDTO } from "../../../dtos/create-product.dto";
import { Product } from "../../../models/product.model";
import { ProductRepository } from "../../../repository/product.repository.interface";
import { UpdateProductRequestDTO } from "../../../dtos/update-product.dto";
import { CategoryEntity } from "../entities/category";
import { Category } from "../../../models/category.model";

@injectable()
export class ProductRepositoryImpl implements ProductRepository {
  private repository: Repository<ProductEntity>;
  private categoryRepository: Repository<CategoryEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductEntity);
    this.categoryRepository = AppDataSource.getRepository(CategoryEntity);
  }

  async create(product: CreateProductRequestDTO): Promise<Product | null> {
    const { categoryId } = product;

    const newProduct = this.repository.create({
      ...product,
      category: { id: product.categoryId },
    });

    const createdProduct = await this.repository.save(newProduct);

    return createdProduct ? { ...createdProduct, categoryId } : null;
  }

  async update(product: UpdateProductRequestDTO): Promise<Product | null> {
    const { id, categoryId } = product;

    const result = await this.repository.update(
      { id },
      { ...product, category: { id: categoryId } }
    );

    return result ? await this.findById(id) : null;
  }

  async remove(productId: number): Promise<number | null | undefined> {
    const result = await this.repository.delete({
      id: productId,
    });

    return result.affected;
  }

  async findById(productId: number): Promise<Product | null> {
    const result = await this.repository.findOne({
      where: { id: productId },
      relations: ["category"],
    });

    if (result) return { ...result, categoryId: result?.category.id };

    return null;
  }

  async findByName(name: string, categoryId: number): Promise<Product | null> {
    const result = await this.repository.findOne({
      where: { name },
    });

    if (result) return { ...result, categoryId };

    return null;
  }

  async findByCategoryId(categoryId: number): Promise<Category | null> {
    const result = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    return result;
  }
}
