import { CreateProductRequestDTO } from "./create-product.dto";

export interface UpdateProductRequestDTO
  extends Partial<CreateProductRequestDTO> {
  id: number;
}
