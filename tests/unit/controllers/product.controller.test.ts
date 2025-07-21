import { ProductController } from "../../../src/controller";
import {
  ICreateProductUseCase,
  IEditProductUseCase,
  IFindProductUseCase,
  IRemoveProductUseCase,
} from "../../../src/usecases/interfaces/product.usecase.interface";
import { CreateProductRequestDTO } from "../../../src/dtos/create-product.dto";
import { UpdateProductRequestDTO } from "../../../src/dtos/update-product.dto";
import { Product } from "../../../src/models/product.model";

describe("ProductController", () => {
  let productController: ProductController;
  let mockCreateProductUseCase: jest.Mocked<ICreateProductUseCase>;
  let mockEditProductUseCase: jest.Mocked<IEditProductUseCase>;
  let mockRemoveProductUseCase: jest.Mocked<IRemoveProductUseCase>;
  let mockFindProductUseCase: jest.Mocked<IFindProductUseCase>;

  beforeEach(() => {
    mockCreateProductUseCase = {
      createProduct: jest.fn(),
    };

    mockEditProductUseCase = {
      updateProduct: jest.fn(),
    };

    mockRemoveProductUseCase = {
      removeProduct: jest.fn(),
    };

    mockFindProductUseCase = {
      findProduct: jest.fn(),
    };

    productController = new ProductController(
      mockCreateProductUseCase,
      mockEditProductUseCase,
      mockRemoveProductUseCase,
      mockFindProductUseCase
    );
  });

  const mockProduct: Product = {
    id: 1,
    name: "Produto Teste",
    price: 99.99,
    description: "Descrição do produto teste",
    image: "imagem.jpg",
    categoryId: 1,
  };

  const mockCreateProductData: CreateProductRequestDTO = {
    name: "Produto Teste",
    price: 99.99,
    description: "Descrição do produto teste",
    image: "imagem.jpg",
    categoryId: 1,
  };

  const mockUpdateProductData: UpdateProductRequestDTO = {
    id: 1,
    name: "Produto Atualizado",
    price: 149.99,
  };

  describe("createProduct", () => {
    it("deve criar um produto com sucesso", async () => {
      // Arrange
      mockCreateProductUseCase.createProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await productController.createProduct(
        mockCreateProductData
      );

      // Assert
      expect(mockCreateProductUseCase.createProduct).toHaveBeenCalledWith(
        mockCreateProductData
      );
      expect(result).toEqual(mockProduct);
    });

    it("deve propagar erro do use case", async () => {
      // Arrange
      const useCaseError = new Error("Use case error");
      mockCreateProductUseCase.createProduct.mockRejectedValue(useCaseError);

      // Act & Assert
      await expect(
        productController.createProduct(mockCreateProductData)
      ).rejects.toThrow(useCaseError);
    });
  });

  describe("updateProduct", () => {
    it("deve atualizar um produto com sucesso", async () => {
      // Arrange
      const updatedProduct = { ...mockProduct, ...mockUpdateProductData };
      mockEditProductUseCase.updateProduct.mockResolvedValue(updatedProduct);

      // Act
      const result = await productController.updateProduct(
        1,
        mockUpdateProductData
      );

      // Assert
      expect(mockEditProductUseCase.updateProduct).toHaveBeenCalledWith(
        1,
        mockUpdateProductData
      );
      expect(result).toEqual(updatedProduct);
    });

    it("deve propagar erro do use case", async () => {
      // Arrange
      const useCaseError = new Error("Use case error");
      mockEditProductUseCase.updateProduct.mockRejectedValue(useCaseError);

      // Act & Assert
      await expect(
        productController.updateProduct(1, mockUpdateProductData)
      ).rejects.toThrow(useCaseError);
    });
  });

  describe("removeProduct", () => {
    it("deve remover um produto com sucesso", async () => {
      // Arrange
      const productId = 1;
      mockRemoveProductUseCase.removeProduct.mockResolvedValue(productId);

      // Act
      const result = await productController.removeProduct(productId);

      // Assert
      expect(mockRemoveProductUseCase.removeProduct).toHaveBeenCalledWith(
        productId
      );
      expect(result).toBe(productId);
    });

    it("deve propagar erro do use case", async () => {
      // Arrange
      const productId = 1;
      const useCaseError = new Error("Use case error");
      mockRemoveProductUseCase.removeProduct.mockRejectedValue(useCaseError);

      // Act & Assert
      await expect(productController.removeProduct(productId)).rejects.toThrow(
        useCaseError
      );
    });
  });

  describe("findById", () => {
    it("deve encontrar um produto por ID com sucesso", async () => {
      // Arrange
      const productId = 1;
      mockFindProductUseCase.findProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await productController.findById(productId);

      // Assert
      expect(mockFindProductUseCase.findProduct).toHaveBeenCalledWith(
        productId
      );
      expect(result).toEqual(mockProduct);
    });

    it("deve propagar erro do use case", async () => {
      // Arrange
      const productId = 1;
      const useCaseError = new Error("Use case error");
      mockFindProductUseCase.findProduct.mockRejectedValue(useCaseError);

      // Act & Assert
      await expect(productController.findById(productId)).rejects.toThrow(
        useCaseError
      );
    });

    it("deve buscar produtos com diferentes IDs", async () => {
      // Arrange
      const productId = 999;
      const differentProduct = { ...mockProduct, id: productId };
      mockFindProductUseCase.findProduct.mockResolvedValue(differentProduct);

      // Act
      const result = await productController.findById(productId);

      // Assert
      expect(mockFindProductUseCase.findProduct).toHaveBeenCalledWith(
        productId
      );
      expect(result).toEqual(differentProduct);
    });
  });

  describe("integração entre métodos", () => {
    it("deve manter isolamento entre chamadas de métodos", async () => {
      // Arrange
      mockCreateProductUseCase.createProduct.mockResolvedValue(mockProduct);
      mockFindProductUseCase.findProduct.mockResolvedValue(mockProduct);

      // Act
      await productController.createProduct(mockCreateProductData);
      await productController.findById(1);

      // Assert
      expect(mockCreateProductUseCase.createProduct).toHaveBeenCalledTimes(1);
      expect(mockFindProductUseCase.findProduct).toHaveBeenCalledTimes(1);

      // Verificar que cada use case foi chamado com parâmetros corretos
      expect(mockCreateProductUseCase.createProduct).toHaveBeenCalledWith(
        mockCreateProductData
      );
      expect(mockFindProductUseCase.findProduct).toHaveBeenCalledWith(1);
    });
  });
});
