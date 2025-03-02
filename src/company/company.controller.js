import Company from './company.model.js'

//Crear empresa (solo Admin)
export const createCompany = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Only admins can create companies' })
        }

        const { name, category, impactLevel, yearsInBusiness } = req.body
        const newCompany = new Company({ name, category, impactLevel, yearsInBusiness })
        await newCompany.save()

        res.status(201).json(newCompany)
    } catch (err) {
        res.status(500).json(
            {
                message: 'Error creating company', 
                error: err.message        
            }
        )
    }
}

//Obtener todas las empresas
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
        res.json(companies)
    } catch (err) {
        res.status(500).json(
            {
                message: 'Error retrieving companies',
                error: err.message
            }
        )
    }
}

//Obtener empresa por ID
export const getCompanyById = async(req, res) => {
    try {
        const company = await Company.findById(req.params.id)
        if (!company) return res.status(404).json({ message: 'Company not found' })
        res.json(company)
    } catch (err) {
        res.status(500).json(
            { 
                message: 'Error retrieving company', 
                error: err.message 
            }
        )
    }
}

// Actualizar empresa (solo ADMIN)
export const updateCompany = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Only admins can update companies' })
        }

        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedCompany) return res.status(404).json({ message: 'Company not found' })
        res.json(updatedCompany)
    } catch (err) {
        res.status(500).json(
            { 
                message: 'Error updating company', 
                error: err.message 
            }
        )
    }
}
  
  // Filtrar y ordenar empresas (por categoría, años de trayectoria, etc.)
export const filterAndSortCompanies = async (req, res) => {
    try {
        const { category, yearsInBusiness, sortBy } = req.query
    
        let filter = {}
        if (category) {
            filter.category = category
        }
        if (yearsInBusiness) {
            filter.yearsInBusiness = { $gte: yearsInBusiness }
        }
    
        const sort = {}
        if (sortBy === 'yearsInBusiness') {
            sort.yearsInBusiness = 1 // Ascendente
        } else if (sortBy === 'impactLevel') {
            sort.impactLevel = 1 // Ascendente
        }
    
        const companies = await Company.find(filter).sort(sort)
        res.json(companies)
    } catch (err) {
        res.status(500).json(
            { 
                message: 'Error filtering and sorting companies', 
                error: err.message 
            }
        )
    }
}
