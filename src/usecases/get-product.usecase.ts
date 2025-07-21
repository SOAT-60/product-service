import { inject, injectable } from "inversify";
import { IFindProductUseCase } from "./interfaces/product.usecase.interface";
import { ProductRepository } from "../repository/product.repository.interface";
import { Product } from "../models/product.model";

@injectable()
export class FindProductUseCase implements IFindProductUseCase {
  constructor(
    @inject("ProductRepository")
    private readonly repository: ProductRepository
  ) {}

  async findProduct(id: number): Promise<Product> {
    try {
      const product = await this.repository.findById(id);

      if (!product) {
        throw new Error(
          JSON.stringify({
            message: `Produto ${id} não encontrado!`,
            status: 404,
          })
        );
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
