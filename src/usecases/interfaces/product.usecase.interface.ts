import { CreateProductRequestDTO } from "../../dtos/create-product.dto";
import { UpdateProductRequestDTO } from "../../dtos/update-product.dto";
import { Product } from "../../models/product.model";

export interface ICreateProductUseCase {
  createProduct(productData: CreateProductRequestDTO): Promise<Product>;
}

export interface IEditProductUseCase {
  updateProduct(
    id: number,
    productData: UpdateProductRequestDTO
  ): Promise<Product>;
}

export interface IRemoveProductUseCase {
  removeProduct(id: number): Promise<number>;
}

export interface IFindProductUseCase {
  findProduct(id: number): Promise<Product>;
}
