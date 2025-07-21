import { RemoveProductUseCase } from "../../../src/usecases/delete-product.usecase";
import { ProductRepository } from "../../../src/repository/product.repository.interface";

describe("RemoveProductUseCase", () => {
  let removeProductUseCase: RemoveProductUseCase;
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

    removeProductUseCase = new RemoveProductUseCase(mockRepository);
  });

  describe("removeProduct", () => {
    it("deve remover um produto com sucesso", async () => {
      // Arrange
      const productId = 1;
      mockRepository.remove.mockResolvedValue(1); // 1 linha afetada

      // Act
      const result = await removeProductUseCase.removeProduct(productId);

      // Assert
      expect(mockRepository.remove).toHaveBeenCalledWith(productId);
      expect(result).toBe(productId);
    });

    it("deve lançar erro se falhar ao deletar produto (retorna 0)", async () => {
      // Arrange
      const productId = 1;
      mockRepository.remove.mockResolvedValue(0); // Nenhuma linha afetada

      // Act & Assert
      await expect(
        removeProductUseCase.removeProduct(productId)
      ).rejects.toThrow(
        JSON.stringify({ message: "Erro ao deletar produto!", status: 500 })
      );

      expect(mockRepository.remove).toHaveBeenCalledWith(productId);
    });

    it("deve lançar erro se falhar ao deletar produto (retorna null)", async () => {
      // Arrange
      const productId = 1;
      mockRepository.remove.mockResolvedValue(null);

      // Act & Assert
      await expect(
        removeProductUseCase.removeProduct(productId)
      ).rejects.toThrow(
        JSON.stringify({ message: "Erro ao deletar produto!", status: 500 })
      );

      expect(mockRepository.remove).toHaveBeenCalledWith(productId);
    });

    it("deve lançar erro se falhar ao deletar produto (retorna undefined)", async () => {
      // Arrange
      const productId = 1;
      mockRepository.remove.mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        removeProductUseCase.removeProduct(productId)
      ).rejects.toThrow(
        JSON.stringify({ message: "Erro ao deletar produto!", status: 500 })
      );

      expect(mockRepository.remove).toHaveBeenCalledWith(productId);
    });

    it("deve propagar erro do repositório", async () => {
      // Arrange
      const productId = 1;
      const repositoryError = new Error("Database connection failed");
      mockRepository.remove.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        removeProductUseCase.removeProduct(productId)
      ).rejects.toThrow(repositoryError);
    });

    it("deve funcionar com diferentes IDs de produto", async () => {
      // Arrange
      const productId = 999;
      mockRepository.remove.mockResolvedValue(1);

      // Act
      const result = await removeProductUseCase.removeProduct(productId);

      // Assert
      expect(mockRepository.remove).toHaveBeenCalledWith(productId);
      expect(result).toBe(productId);
    });
  });
});
