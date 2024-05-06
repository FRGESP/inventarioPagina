import { Router } from "express";
import { deleteProductTicket, generarVenta, getSuma, getTicket, getVentaTicket, subirTicket,} from "../controllers/inicio.controllers.js";


const router = Router();


//Obetener todos los elementos
router.get("/ticket", getTicket);
//Obetener El total
router.get("/Total", getSuma);
// //Obetener un elemento por ID
router.get("/ticket/:id", getVentaTicket);
//Agregar a la venta
router.post("/ventaTicket", generarVenta);
//Subir Cliente
router.post("/subirTicket",subirTicket);
//Borrar elemento
router.delete("/productoTicket/:id", deleteProductTicket);

export default router;