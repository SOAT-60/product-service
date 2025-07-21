import { injectable, inject } from "inversify";
import { CreateProductRequestDTO } from "../dtos/create-product.dto";
import { ICreateProductUseCase } from "./interfaces/product.usecase.interface";
import { ProductRepository } from "../repository/product.repository.interface";

@injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @inject("ProductRepository")
    private readonly repository: ProductRepository
  ) {}

  async createProduct(productData: CreateProductRequestDTO) {
    try {
      const existingCategory = await this.repository.findByCategoryId(
        productData.categoryId
      );

      if (!existingCategory) {
        throw new Error(
          JSON.stringify({ message: "Categoria inexistente", status: 404 })
        );
      }

      const existingProduct = await this.repository.findByName(
        productData.name,
        productData.categoryId
      );

      if (existingProduct) {
        throw new Error(
          JSON.stringify({
            message: `Produto já esta cadastrado: ID: ${existingProduct.id}!`,
            status: 400,
          })
        );
      }

      const product = await this.repository.create(productData);

      if (!product) {
        throw new Error(
          JSON.stringify({
            message: `Erro ao criar produto!`,
            status: 500,
          })
        );
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
