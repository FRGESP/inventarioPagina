import { Router } from "express";
import { getProductosTicket } from "../controllers/facturas.controllers.js";


const router = Router();

// // Rutas productos

// //Obetener todos los elementos
// router.get("/productos", getProducts);
// //Obetener un elemento por ID
// router.get("/productos/:id", getProduct);
// //Crear un elemento
// router.post("/productos", createProduct);
// //Actualizar elemento
// router.put("/productos/:id", updateProduct);
// //Borrar elemento
// router.delete("/productos/:id", deleteProduct);
// //Obetener elemento por nombre
// router.post("/productosNombre",getName);

// // Vistas

//router.get("/productosVista",getProductosTicket);
router.get("/ticketVista/:id",getProductosTicket)
// router.get("/nombresProveedores",getNombresProveedores)
// router.get("/nombresCategorias",getNombresCategorias)


export default router;