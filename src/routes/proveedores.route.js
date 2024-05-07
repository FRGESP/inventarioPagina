import { Router } from "express";
import { createProveedor, deleteProveedor, getProveedor, getProveedorName, getProveedores, updateProveedor } from "../controllers/proveedores.controllers.js";


const router = Router();

// Rutas productos

//Crear un elemento
router.post("/proveedores", createProveedor);
//Actualizar elemento
router.put("/proveedor/:id", updateProveedor);
//Borrar elemento
router.delete("/proveedor/:id", deleteProveedor);
//Obetener elemento por nombre
router.post("/proveedorNombre",getProveedorName);

// Vistas

router.get("/proveedoresVista",getProveedores);
router.get("/proveedor/:id",getProveedor);

export default router;