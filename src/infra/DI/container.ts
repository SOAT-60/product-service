import "reflect-metadata";
import { Container } from "inversify";
import { CreateProductUseCase } from "../../usecases/create-product.usecase";
import { ProductController } from "../../controller";
import {
  ICreateProductUseCase,
  IEditProductUseCase,
  IFindProductUseCase,
  IRemoveProductUseCase,
} from "../../usecases/interfaces/product.usecase.interface";
import { ProductRepositoryImpl } from "../typeORM/repository/product.repository";
import { ProductRepository } from "../../repository/product.repository.interface";
import { EditProductUseCase } from "../../usecases/edit-product.usecase";
import { RemoveProductUseCase } from "../../usecases/delete-product.usecase";
import { FindProductUseCase } from "../../usecases/get-product.usecase";

const container = new Container();
container
  .bind<ProductRepository>("ProductRepository")
  .to(ProductRepositoryImpl);
container.bind<ProductController>("ProductController").to(ProductController);
container
  .bind<ICreateProductUseCase>("CreateProductUseCase")
  .to(CreateProductUseCase);
container
  .bind<IEditProductUseCase>("EditProductUseCase")
  .to(EditProductUseCase);
container
  .bind<IRemoveProductUseCase>("RemoveProductUseCase")
  .to(RemoveProductUseCase);
container
  .bind<IFindProductUseCase>("FindProductUseCase")
  .to(FindProductUseCase);

export { container };
