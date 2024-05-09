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
//Obetener elemento por nombre
router.post("/resgistrosPrecioNombre",getNameRP);

export default router;