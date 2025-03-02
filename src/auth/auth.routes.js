import { Router } from "express"
import { registerUser, loginUser } from "./auth.controller.js"
import { registerValidator, loginValidator } from "../../helpers/validators.js" // Puedes agregar validaciones para los campos

const api = Router()

// Rutas de autenticación
api.post("/register", registerValidator, registerUser) // Validación en el body para el registro
api.post("/login", loginValidator, loginUser) // Validación en el body para login

export default api
