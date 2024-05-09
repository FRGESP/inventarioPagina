import { Router } from "express";
import { getFactura, getTicketFact } from "../controllers/facturasTest.controller.js";

const router = Router();


//Obetener un elemento por ID
router.get("/factura/:id", getFactura);

router.get("/facturaDetalle/:id",getTicketFact)
export default router;
