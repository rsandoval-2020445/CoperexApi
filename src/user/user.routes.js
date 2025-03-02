import { Router } from "express"
import { createUser, loginUser } from "./user.controller.js"

const router = Router()

// Rutas de autenticación
router.post("/register", createUser)  
router.post("/login", loginUser)     

export default router
