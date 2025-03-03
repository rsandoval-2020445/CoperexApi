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
    .custom(existUsername), // Validar si el nombre de usuario ya existe
  body("password", "La contraseña debe ser fuerte y tener al menos 8 caracteres")
    .notEmpty()
    .isStrongPassword()
    .isLength({ min: 8 }),
  body("phone", "El teléfono no puede estar vacío").notEmpty().isMobilePhone(),
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

// Validación para la creación de empresa
export const companyValidation = [
  body("name", "Company name is required").notEmpty(),
  body("name", "Company name must be at least 3 characters").isLength({ min: 3 }),
  body("name", "Company name should not exceed 50 characters").isLength({ max: 50 }),
  body("category", "Category is required").notEmpty(),
  body("category", "Category must be one of Tech, Healthcare, Finance, or Retail").isIn(["Tech", "Healthcare", "Finance", "Retail"]),
  body("impactLevel", "Impact level is required").notEmpty(),
  body("impactLevel", "Impact level must be Low, Medium or High").isIn(["Low", "Medium", "High"]),
  body("yearsInBusiness", "Years in business is required").notEmpty(),
  body("yearsInBusiness", "Years in business must be a positive number").isInt({ min: 1 }),
  body("yearsInBusiness", "Years in business cannot exceed 100").isInt({ max: 100 }),
  validateErrors, // Llamada a la función que valida los errores
]
