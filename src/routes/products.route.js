import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getName,
  getNombresCategorias,
  getNombresProveedores,
  getProduct,
  getProductVista,
  getProducts,
  getProductsVista,
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

// Vistas

router.get("/productosVista",getProductsVista);
router.get("/productosVista/:id",getProductVista)
router.get("/nombresProveedores",getNombresProveedores)
router.get("/nombresCategorias",getNombresCategorias)


export default router;
