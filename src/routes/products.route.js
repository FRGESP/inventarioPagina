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

router.get("/productos", getProducts);

router.get("/productos/:id", getProduct);

router.post("/productos", createProduct);

router.put("/productos/:id", updateProduct);

router.delete("/productos/:id", deleteProduct);

//Obtener por nombre

router.post("/productosNombre",getName);

export default router;
