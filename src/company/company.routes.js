import { Router } from "express"
import { getAllCompanies, getCompanyById, createCompany } from "./company.controller.js"

const companyRoutes = Router()

// Definir las rutas
companyRoutes.get("/", getAllCompanies)
companyRoutes.get("/:id", getCompanyById)
companyRoutes.post("/", createCompany)

// Exportar como default
export default companyRoutes  // Aquí cambiamos a un export default
