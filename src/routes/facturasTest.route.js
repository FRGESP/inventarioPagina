import { Router } from "express";
import { getProductsPDF } from "../controllers/facturasTest.controller.js";

const router = Router();
router.get("/productosPDF", getProductsPDF);

export default router;
