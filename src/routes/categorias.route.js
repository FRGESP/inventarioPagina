import { Router } from "express";
import { createCategoria, deleteCategoria, getCategoria, getCategoriaVista, getCategorias, getName, updateCategoria } from "../controllers/categorias.controllers.js";


const router = Router();

// Rutas productos

//Obetener todos los elementos
router.get("/categorias", getCategorias);
//Obetener un elemento por ID
router.get("/categorias/:id", getCategoria);
//Crear un elemento
router.post("/categorias", createCategoria);
//Actualizar elemento
router.put("/categorias/:id", updateCategoria);
//Borrar elemento
router.delete("/categorias/:id", deleteCategoria);
//Obetener elemento por nombre
router.post("/categoriasNombre",getName);
// Vistas
router.get("/categoriasVista/:id",getCategoriaVista)

export default router;