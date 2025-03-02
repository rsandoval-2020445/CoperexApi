import { body } from "express-validator"
import { validateErrors } from "./validate.error.js" // Llamar a la función de validación de errores
import { existUsername } from "./db.validator.js" // Función para validar que el username no existe en la DB

// Validación para el registro de usuario
export const registerValidator = [
  body("name", "El nombre no puede estar vacío").notEmpty(),
  body("surname", "El apellido es obligatorio").notEmpty(),
  body("email", "El email no puede estar vacío o no es válido").notEmpty().isEmail(),
  body("username", "El nombre de usuario no puede estar vacío")
    .notEmpty()
    .toLowerCase()
    .custom(existUsername), // Comprobar que el nombre de usuario no existe en la base de datos
  body("password", "La contraseña debe ser fuerte y tener al menos 8 caracteres")
    .notEmpty()
    .isStrongPassword()
    .isLength({ min: 8 }),
  body("phone", "El teléfono no puede estar vacío").notEmpty().isMobilePhone(),
  validateErrors, // Llamada a la función que valida los errores
]

// Validación para login
export const loginValidator = [
  body("username", "Username cannot be empty").notEmpty().toLowerCase(),
  body("password", "Password must be strong and at least 8 characters long")
    .notEmpty()
    .isStrongPassword()
    .isLength({ min: 8 }),
  validateErrors, // Llamada a la función que valida los errores
]
