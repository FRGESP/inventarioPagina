import { Router } from "express";
import { createClient, deleteClient, getCliente, getClientes, getName } from "../controllers/clientes.controllers.js";


const router = Router();

// Rutas productos

//Obetener todos los elementos
router.get("/clientesVista", getClientes);
//Obetener un elemento por ID
router.get("/clientes/:id", getCliente);
//Crear un elemento
router.post("/clientes", createClient);
//Borrar elemento
router.delete("/clientes/:id", deleteClient);
//Obetener elemento por nombre
router.post("/clienteNombre",getName);

export default router;