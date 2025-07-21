import { CreateProductUseCase } from "../../../src/usecases/create-product.usecase";
import { ProductRepository } from "../../../src/repository/product.repository.interface";
import { CreateProductRequestDTO } from "../../../src/dtos/create-product.dto";
import { Product } from "../../../src/models/product.model";
import { Category } from "../../../src/models/category.model";

describe("CreateProductUseCase", () => {
  let createProductUseCase: CreateProductUseCase;
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

    createProductUseCase = new CreateProductUseCase(mockRepository);
  });

  const mockProductData: CreateProductRequestDTO = {
    name: "Produto Teste",
    price: 99.99,
    description: "Descrição do produto teste",
    image: "imagem.jpg",
    categoryId: 1,
  };

  const mockCategory: Category = {
    id: 1,
    name: "Categoria Teste",
  };

  const mockProduct: Product = {
    id: 1,
    ...mockProductData,
  };

  describe("createProduct", () => {
    it("deve criar um produto com sucesso", async () => {
      // Arrange
      mockRepository.findByCategoryId.mockResolvedValue(mockCategory);
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockProduct);

      // Act
      const result = await createProductUseCase.createProduct(mockProductData);

      // Assert
      expect(mockRepository.findByCategoryId).toHaveBeenCalledWith(1);
      expect(mockRepository.findByName).toHaveBeenCalledWith(
        "Produto Teste",
        1
      );
      expect(mockRepository.create).toHaveBeenCalledWith(mockProductData);
      expect(result).toEqual(mockProduct);
    });

    it("deve lançar erro se categoria não existir", async () => {
      // Arrange
      mockRepository.findByCategoryId.mockResolvedValue(null);

      // Act & Assert
      await expect(
        createProductUseCase.createProduct(mockProductData)
      ).rejects.toThrow(
        JSON.stringify({ message: "Categoria inexistente", status: 404 })
      );

      expect(mockRepository.findByCategoryId).toHaveBeenCalledWith(1);
      expect(mockRepository.findByName).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro se produto já existir", async () => {
      // Arrange
      mockRepository.findByCategoryId.mockResolvedValue(mockCategory);
      mockRepository.findByName.mockResolvedValue(mockProduct);

      // Act & Assert
      await expect(
        createProductUseCase.createProduct(mockProductData)
      ).rejects.toThrow(
        JSON.stringify({
          message: `Produto já esta cadastrado: ID: ${mockProduct.id}!`,
          status: 400,
        })
      );

      expect(mockRepository.findByCategoryId).toHaveBeenCalledWith(1);
      expect(mockRepository.findByName).toHaveBeenCalledWith(
        "Produto Teste",
        1
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro se falhar ao criar produto", async () => {
      // Arrange
      mockRepository.findByCategoryId.mockResolvedValue(mockCategory);
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(null);

      // Act & Assert
      await expect(
        createProductUseCase.createProduct(mockProductData)
      ).rejects.toThrow(
        JSON.stringify({
          message: `Erro ao criar produto!`,
          status: 500,
        })
      );

      expect(mockRepository.create).toHaveBeenCalledWith(mockProductData);
    });

    it("deve propagar erro do repositório", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.findByCategoryId.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        createProductUseCase.createProduct(mockProductData)
      ).rejects.toThrow(repositoryError);
    });
  });
});
