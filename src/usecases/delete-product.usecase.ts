import { inject, injectable } from "inversify";
import { IRemoveProductUseCase } from "./interfaces/product.usecase.interface";
import { ProductRepository } from "../repository/product.repository.interface";

@injectable()
export class RemoveProductUseCase implements IRemoveProductUseCase {
  constructor(
    @inject("ProductRepository")
    private readonly repository: ProductRepository
  ) {}

  async removeProduct(productId: number): Promise<number> {
    try {
      const deleted = await this.repository.remove(productId);

      if (!deleted) {
        throw new Error(
          JSON.stringify({ message: "Erro ao deletar produto!", status: 500 })
        );
      }

      return productId;
    } catch (error) {
      throw error;
    }
  }
}
