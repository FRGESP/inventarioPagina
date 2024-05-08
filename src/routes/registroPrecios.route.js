import { Router } from "express";
import { getNameRP, getRegistrosPrecios, getRegistrosPreciosPorProducto, getRegistrosPreciosProcesados } from "../controllers/registroPrecios.controllers.js";


const router = Router();

// Rutas productos

//Obetener todos los elementos
router.get("/registrosPrecios", getRegistrosPrecios);
//Obetener todos los elementos
router.get("/registrosPreciosProcesados/:id", getRegistrosPreciosProcesados);
//Obetener un elemento por ID
router.get("/resgistrosPorProducto/:id", getRegistrosPreciosPorProducto);
// //Crear un elemento
// router.post("/productos", createProduct);
// //Actualizar elemento
// router.put("/productos/:id", updateProduct);
// //Borrar elemento
// router.delete("/productos/:id", deleteProduct);
//Obetener elemento por nombre
router.post("/resgistrosPrecioNombre",getNameRP);

// // Vistas

// router.get("/productosVista",getProductsVista);
// router.get("/productosVista/:id",getProductVista)
// router.get("/nombresProveedores",getNombresProveedores)
// router.get("/nombresCategorias",getNombresCategorias)


export default router;