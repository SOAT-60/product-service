import { FindProductUseCase } from "../../../src/usecases/get-product.usecase";
import { ProductRepository } from "../../../src/repository/product.repository.interface";
import { Product } from "../../../src/models/product.model";

describe("FindProductUseCase", () => {
  let findProductUseCase: FindProductUseCase;
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

    findProductUseCase = new FindProductUseCase(mockRepository);
  });

  const mockProduct: Product = {
    id: 1,
    name: "Produto Teste",
    price: 99.99,
    description: "Descrição do produto teste",
    image: "imagem.jpg",
    categoryId: 1,
  };

  describe("findProduct", () => {
    it("deve encontrar um produto com sucesso", async () => {
      // Arrange
      const productId = 1;
      mockRepository.findById.mockResolvedValue(mockProduct);

      // Act
      const result = await findProductUseCase.findProduct(productId);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it("deve lançar erro se produto não for encontrado", async () => {
      // Arrange
      const productId = 999;
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(findProductUseCase.findProduct(productId)).rejects.toThrow(
        JSON.stringify({
          message: `Produto ${productId} não encontrado!`,
          status: 404,
        })
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
    });

    it("deve propagar erro do repositório", async () => {
      // Arrange
      const productId = 1;
      const repositoryError = new Error("Database connection failed");
      mockRepository.findById.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(findProductUseCase.findProduct(productId)).rejects.toThrow(
        repositoryError
      );
    });

    it("deve buscar produtos com IDs diferentes", async () => {
      // Arrange
      const differentProduct: Product = {
        ...mockProduct,
        id: 5,
        name: "Produto Diferente",
      };

      mockRepository.findById.mockResolvedValue(differentProduct);

      // Act
      const result = await findProductUseCase.findProduct(5);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(5);
      expect(result).toEqual(differentProduct);
      expect(result.id).toBe(5);
      expect(result.name).toBe("Produto Diferente");
    });

    it("deve retornar produto com todas as propriedades", async () => {
      // Arrange
      const completeProduct: Product = {
        id: 10,
        name: "Produto Completo",
        price: 199.99,
        description: "Descrição completa do produto",
        image: "produto-completo.jpg",
        categoryId: 2,
      };

      mockRepository.findById.mockResolvedValue(completeProduct);

      // Act
      const result = await findProductUseCase.findProduct(10);

      // Assert
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("price");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("image");
      expect(result).toHaveProperty("categoryId");
      expect(result).toEqual(completeProduct);
    });
  });
});
