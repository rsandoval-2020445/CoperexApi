import { Router } from "express"
import { getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from "./company.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js"  
const companyRoutes = Router()

companyRoutes.get("/", getAllCompanies)
companyRoutes.get("/:id", getCompanyById)
companyRoutes.post("/", validateJwt, isAdmin, createCompany)
companyRoutes.put("/:id", validateJwt, isAdmin, updateCompany)
companyRoutes.delete("/:id", validateJwt, isAdmin, deleteCompany)

export default companyRoutes
