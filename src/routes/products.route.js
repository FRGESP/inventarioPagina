import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getName,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controllers.js";

const router = Router();

// Rutas productos
router.get("/productos", getProducts);
router.get("/productos/:id", getProduct);
router.post("/productos", createProduct);
router.put("/productos/:id", updateProduct);
router.delete("/productos/:id", deleteProduct);
router.post("/productosNombre",getName);

// Rutas Categorias


export default router;
