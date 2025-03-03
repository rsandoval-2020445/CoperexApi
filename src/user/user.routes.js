import { Router } from "express"
import { createUser, loginUser } from "./user.controller.js"
import { registerValidator, loginValidator } from "../../helpers/validators.js" // Importar las validaciones

const router = Router()

// Rutas de autenticación
router.post("/register", registerValidator, createUser)  
router.post("/login", loginValidator, loginUser)         

export default router
