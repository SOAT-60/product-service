import { Router } from "express";
import cors from "cors";
import { container } from "../infra/DI/container";
import { ProductController } from "../controller";

const router = Router();
router.use(cors({ origin: "*" }));

const productController = container.get<ProductController>("ProductController");

router.post("/product/create", async (req, res) => {
  try {
    const body = req.body;

    const product = await productController.createProduct(body);
    res
      .status(200)
      .json({ message: "Produto criado com sucesso", response: product });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto" });
  }
});

router.patch("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const formatNumber = Number(id);
    if (typeof formatNumber !== "number") {
      res
        .status(400)
        .json({ message: "Obrigatório o envio do ID do produto!" });
    }

    const product = await productController.updateProduct(formatNumber, body);

    res
      .status(200)
      .json({ message: "Produto criado com sucesso", response: product });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar produto" });
  }
});

router.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const formatNumber = Number(id);
    if (typeof formatNumber !== "number") {
      res
        .status(400)
        .json({ message: "Obrigatório o envio do ID do produto!" });
    }

    const deleted = await productController.removeProduct(formatNumber);

    res
      .status(200)
      .json({ message: "Produto criado com sucesso", response: deleted });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover produto" });
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const formatNumber = Number(id);
    if (typeof formatNumber !== "number") {
      res
        .status(400)
        .json({ message: "Obrigatório o envio do ID do produto!" });
    }

    const product = await productController.findById(formatNumber);

    res
      .status(200)
      .json({ message: "Produto criado com sucesso", response: product });
  } catch (error: any) {
    if (error) {
      const decodedError = JSON.parse(error.message) as {
        message: string;
        status: number;
      };
      res.status(decodedError.status).json({ message: decodedError.message });
    }

    res.status(500).json({ message: "Erro ao buscar produto" });
  }
});

export const routes = router;
