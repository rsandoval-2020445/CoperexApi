import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "../src/auth/auth.routes.js"
import companyRoutes from "../src/company/company.routes.js"
import reportRoutes from "../src/reports/report.routes.js"  // Rutas de reportes
import { validateJwt } from "../middlewares/validate.jwt.js"

dotenv.config()

const app = express()

// Configuración de middlewares
const configs = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())
  app.use(helmet())
  app.use(morgan("dev"))
}

// Rutas
const routes = (app) => {
  app.use("/api/auth", authRoutes)
  app.use("/api/companies", validateJwt, companyRoutes)
  app.use("/api/reports", reportRoutes)  // Rutas para reportes
}

// Inicializar el servidor
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
