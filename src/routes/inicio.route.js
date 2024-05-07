import { Router } from "express";
import { deleteProductTicket, generarPrimerVenta, generarVenta, getNombreCliente, getSumDetalle, getSuma, getSumaPrimer, getTicket, getTicketPrimerVenta, getVentaTicket, subirTicket,} from "../controllers/inicio.controllers.js";


const router = Router();


//Obetener todos los elementos
router.get("/ticket", getTicket);
//Obtener todo de primer Venta
router.get("/primerTicket",getTicketPrimerVenta)
//Obetener suma de cantidad DetalleVenta
router.get("/sumDetalleVenta", getSumDetalle);
//Obetener El total
router.get("/Total", getSuma);
//Obetener El total primer venta
router.get("/TotalPrimerVenta", getSumaPrimer);
// //Obetener un elemento por ID
router.get("/ticket/:id", getVentaTicket);
// Obtener el nombre del cliente
router.get("/nombreCliente/:id",getNombreCliente);
//Agregar a la venta
router.post("/ventaTicket", generarVenta);
// Primer venta
router.post("/primerVenta", generarPrimerVenta);
//Subir Cliente
router.post("/subirTicket",subirTicket);
//Borrar elemento
router.delete("/productoTicket/:id", deleteProductTicket);

export default router;