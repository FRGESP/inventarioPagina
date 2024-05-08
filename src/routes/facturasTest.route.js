import { Router } from "express";
import { getFactura, getProductsPDF } from "../controllers/facturasTest.controller.js";

const router = Router();
router.get("/productosPDF", getProductsPDF);


//Obetener un elemento por ID
router.get("/factura/:id", getFactura);
export default router;
