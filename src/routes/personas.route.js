import { Router } from "express";

import { deletePersona, getPersona, getPersonas, updatePersona } from "../controllers/personas.controllers.js";


const router = Router();

// Rutas productos

//Obetener todos los elementos
router.get("/personas", getPersonas);
//Obetener un elemento por ID
router.get("/personas/:id", getPersona);
//Crear un elemento
//router.post("/productos", createProduct);
//Actualizar elemento
router.put("/personas/:id", updatePersona);
//Borrar elemento
router.delete("/personas/:id", deletePersona);
// //Obetener elemento por nombre
// router.post("/productosNombre",getName);

// // Vistas

// router.get("/productosVista",getProductsVista);
// router.get("/productosVista/:id",getProductVista)
// router.get("/nombresProveedores",getNombresProveedores)
// router.get("/nombresCategorias",getNombresCategorias)


export default router;