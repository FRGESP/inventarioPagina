import { Router } from "express";
import { getProductosTicket } from "../controllers/facturas.controllers.js";


const router = Router();

// // Rutas Factura
router.get("/ticketVista/:id",getProductosTicket)

export default router;