import { inject, injectable } from "inversify";
import {
  ICreateProductUseCase,
  IEditProductUseCase,
  IFindProductUseCase,
  IRemoveProductUseCase,
} from "../usecases/interfaces/product.usecase.interface";
import { CreateProductRequestDTO } from "../dtos/create-product.dto";
import { ProductResponseDTO } from "../dtos/product.response.dto";
import { UpdateProductRequestDTO } from "../dtos/update-product.dto";

@injectable()
export class ProductController {
  constructor(
    @inject("CreateProductUseCase")
    private readonly createProductUseCase: ICreateProductUseCase,
    @inject("EditProductUseCase")
    private readonly editProductUseCase: IEditProductUseCase,
    @inject("RemoveProductUseCase")
    private readonly removeProductUseCase: IRemoveProductUseCase,
    @inject("FindProductUseCase")
    private readonly findProductUseCase: IFindProductUseCase
  ) {}

  async createProduct(
    productData: CreateProductRequestDTO
  ): Promise<ProductResponseDTO> {
    const product = await this.createProductUseCase.createProduct(productData);
    return product;
  }

  async updateProduct(
    id: number,
    productData: UpdateProductRequestDTO
  ): Promise<ProductResponseDTO> {
    const produto = await this.editProductUseCase.updateProduct(
      id,
      productData
    );
    return produto;
  }

  async removeProduct(productId: number): Promise<number> {
    const deleted = await this.removeProductUseCase.removeProduct(productId);
    return deleted;
  }

  async findById(id: number): Promise<ProductResponseDTO> {
    const product = await this.findProductUseCase.findProduct(id);
    return product;
  }
}
