import { inject, injectable } from "inversify";
import { UpdateProductRequestDTO } from "../dtos/update-product.dto";
import { Product } from "../models/product.model";
import { ProductRepository } from "../repository/product.repository.interface";
import { IEditProductUseCase } from "./interfaces/product.usecase.interface";

@injectable()
export class EditProductUseCase implements IEditProductUseCase {
  constructor(
    @inject("ProductRepository")
    private readonly repository: ProductRepository
  ) {}

  async updateProduct(
    id: number,
    productData: UpdateProductRequestDTO
  ): Promise<Product> {
    try {
      const existingProduct = await this.repository.findById(id);

      if (!existingProduct) {
        throw new Error(
          JSON.stringify({ message: "Produto não encontrado!", status: 404 })
        );
      }

      const product = await this.repository.update(productData);

      if (!product) {
        throw new Error(
          JSON.stringify({ message: "Erro ao atualizar produto!", status: 500 })
        );
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
