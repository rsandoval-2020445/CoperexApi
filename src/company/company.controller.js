import { validationResult } from "express-validator"  // Importar validaciones de express-validator
import Company from "./company.model.js"
import { companyValidation } from "../../helpers/validators.js"  // Importamos las validaciones de empresa

// Crear empresa
export const createCompany = async (req, res) => {
  try {
    // Validar los datos con express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, category, impactLevel, yearsInBusiness, status } = req.body
    const newCompany = new Company({ name, category, impactLevel, yearsInBusiness, status })

    await newCompany.save()
    res.status(201).json({ message: "Company created successfully", company: newCompany })
  } catch (err) {
    res.status(500).json({ message: "Error creating company", error: err.message })
  }
}

// Obtener todas las empresas con paginación, filtros y ordenación
export const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, impactLevel, sortBy = 'name', sortOrder = 'asc' } = req.query
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    let filter = {}
    if (category) filter.category = category
    if (impactLevel) filter.impactLevel = impactLevel

    let sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    const companies = await Company.find(filter)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)

    const totalCompanies = await Company.countDocuments(filter)
    const totalPages = Math.ceil(totalCompanies / limitNumber)

    res.json({
      totalCompanies,
      totalPages,
      currentPage: pageNumber,
      companies
    })
  } catch (err) {
    res.status(500).json({ message: "Error retrieving companies", error: err.message })
  }
}

// Obtener empresa por ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) return res.status(404).json({ message: 'Company not found' })
    res.json(company)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving company', error: err.message })
  }
}

// Actualizar empresa por ID
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id
    const updatedData = req.body

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updatedData, { new: true })

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" })
    }

    res.json(updatedCompany)
  } catch (err) {
    res.status(500).json({ message: "Error updating company", error: err.message })
  }
}

// Eliminar empresa por ID
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id
    const deletedCompany = await Company.findByIdAndDelete(companyId)

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" })
    }

    res.json({ message: "Company deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting company", error: err.message })
  }
}
