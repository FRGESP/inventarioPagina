 import { Router } from "express";
import { BuscaDevolucion, updateVentas } from "../controllers/devoluciones.controllers.js";


const router = Router();

 // Rutas productos

//Obetener todos los elementos
 router.get("/devoluciones/:id", BuscaDevolucion);
// //Obetener un elemento por ID
// router.get("/productos/:id", getProduct);
// //Crear un elemento
// router.post("/productos", createProduct);
// //Actualizar elemento
 router.put("/devolucion/:id", updateVentas);
// //Borrar elemento
// router.delete("/productos/:id", deleteProduct);
// //Obetener elemento por nombre
// router.post("/productosNombre",getName);

// // Vistas

// router.get("/productosVista",getProductsVista);
// router.get("/productosVista/:id",getProductVista)
// router.get("/nombresProveedores",getNombresProveedores)
// router.get("/nombresCategorias",getNombresCategorias)


export default router;