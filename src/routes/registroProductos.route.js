import { Router } from "express";
import { getAccion, getIDRegistro, getRegistrosVista } from "../controllers/registroProductos.controllers.js";


const router = Router();

// Rutas Registros

router.post("/productosAccion",getAccion);
router.get("/registrosVista",getRegistrosVista);
router.get("/productosID/:id",getIDRegistro);

export default router;