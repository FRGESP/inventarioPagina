import { Router } from "express";
import { getClienteVista, getVentaVista, getVentasVista } from "../controllers/ventas.controllers.js";


const router = Router();

// Vistas

router.get("/ventasVista",getVentasVista);
router.get("/ventasIDVista/:id",getVentaVista);
router.get("/clientesIDVista/:id",getClienteVista);

export default router;