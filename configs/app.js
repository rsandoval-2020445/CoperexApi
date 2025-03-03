import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "../src/auth/auth.routes.js"
import companyRoutes from "../src/company/company.routes.js"
import reportRoutes from "../src/reports/report.routes.js"
import { validateJwt } from "../middlewares/validate.jwt.js"
import { fileURLToPath } from "url" // Para obtener la URL del módulo
import path from "path"  // Para trabajar con rutas de archivos
import { errorHandler } from "../middlewares/errorHandler.js" // Middleware de manejo de errores

dotenv.config()

const app = express()

// Obtener el nombre del archivo actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)  // Obtener el directorio de este archivo

// Configuración de middlewares
const configs = (app) => {
  app.use(express.json()) 
  app.use(express.urlencoded({ extended: false })) 
  app.use(cors()) 
  app.use(helmet()) 
  app.use(morgan("dev"))
}

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public"))) // Configura la carpeta 'public' para archivos estáticos

// Configuración de rutas
const routes = (app) => {
  app.use("/api/auth", authRoutes)
  app.use("/api/companies", validateJwt, companyRoutes)
  app.use("/api/reports", reportRoutes)
}

// Usar el middleware de manejo de errores después de todas las rutas
app.use(errorHandler)

// Inicialización del servidor
export const initServer = async () => {
  try {
    configs(app) 
    routes(app)
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.error("Server init failed:", err) 
  }
}
