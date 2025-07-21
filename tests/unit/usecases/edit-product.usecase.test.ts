import { EditProductUseCase } from "../../../src/usecases/edit-product.usecase";
import { ProductRepository } from "../../../src/repository/product.repository.interface";
import { UpdateProductRequestDTO } from "../../../src/dtos/update-product.dto";
import { Product } from "../../../src/models/product.model";

describe("EditProductUseCase", () => {
  let editProductUseCase: EditProductUseCase;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByCategoryId: jest.fn(),
    };

    editProductUseCase = new EditProductUseCase(mockRepository);
  });

  const mockExistingProduct: Product = {
    id: 1,
    name: "Produto Original",
    price: 50.0,
    description: "Descrição original",
    image: "imagem_original.jpg",
    categoryId: 1,
  };

  const mockUpdateData: UpdateProductRequestDTO = {
    id: 1,
    name: "Produto Atualizado",
    price: 75.0,
    description: "Descrição atualizada",
  };

  const mockUpdatedProduct: Product = {
    ...mockExistingProduct,
    ...mockUpdateData,
  };

  describe("updateProduct", () => {
    it("deve atualizar um produto com sucesso", async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockExistingProduct);
      mockRepository.update.mockResolvedValue(mockUpdatedProduct);

      // Act
      const result = await editProductUseCase.updateProduct(1, mockUpdateData);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(mockUpdateData);
      expect(result).toEqual(mockUpdatedProduct);
    });

    it("deve lançar erro se produto não existir", async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        editProductUseCase.updateProduct(1, mockUpdateData)
      ).rejects.toThrow(
        JSON.stringify({ message: "Produto não encontrado!", status: 404 })
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it("deve lançar erro se falhar ao atualizar produto", async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockExistingProduct);
      mockRepository.update.mockResolvedValue(null);

      // Act & Assert
      await expect(
        editProductUseCase.updateProduct(1, mockUpdateData)
      ).rejects.toThrow(
        JSON.stringify({ message: "Erro ao atualizar produto!", status: 500 })
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(mockUpdateData);
    });

    it("deve propagar erro do repositório", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.findById.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        editProductUseCase.updateProduct(1, mockUpdateData)
      ).rejects.toThrow(repositoryError);
    });

    it("deve atualizar apenas campos fornecidos", async () => {
      // Arrange
      const partialUpdateData: UpdateProductRequestDTO = {
        id: 1,
        name: "Apenas nome atualizado",
      };

      mockRepository.findById.mockResolvedValue(mockExistingProduct);
      mockRepository.update.mockResolvedValue({
        ...mockExistingProduct,
        name: "Apenas nome atualizado",
      });

      // Act
      const result = await editProductUseCase.updateProduct(
        1,
        partialUpdateData
      );

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(partialUpdateData);
      expect(result.name).toBe("Apenas nome atualizado");
      expect(result.price).toBe(mockExistingProduct.price); // Outros campos mantidos
    });
  });
});
