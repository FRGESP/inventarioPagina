import { Router } from "express";

import { createPersona, deletePersona, getNombre, getPersona, getPersonas, updatePersona } from "../controllers/personas.controllers.js";


const router = Router();

// Rutas productos

//Obetener todos los elementos
router.get("/personas", getPersonas);
//Obetener un elemento por ID
router.get("/personas/:id", getPersona);
//Crear un elemento
router.post("/personas", createPersona);
//Actualizar elemento
router.put("/personas/:id", updatePersona);
//Borrar elemento
router.delete("/personas/:id", deletePersona);
// //Obetener elemento por nombre
router.post("/personasNombre/",getNombre);

router.post("/personas/:id",getPersona);


export default router;