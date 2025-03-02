import ExcelJS from 'exceljs'
import Company from '../company/company.model.js'

export const generateReport = async (req, res) => {
    try {
        // Crear una nueva instancia de un workbook de Excel
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Companies Report')

        // Definir los encabezados de las columnas
        worksheet.columns = [
            { 
                header: 'Company Name', 
                key: 'name', 
                width: 30 
            },
            { 
                header: 'Category', 
                key: 'category', 
                width: 20 
            },
            { 
                header: 'Impact Level', 
                key: 'impactLevel',
                width: 20 
            },
            { 
                header: 'Years in Business', 
                key: 'yearsInBusiness', 
                width: 20 
            },
            { 
                header: 'Status', 
                key: 'status', 
                width: 15 
            }
        ]

        // Obtener las empresas desde la base de datos
        const companies = await Company.find()

        // Agregar cada empresa al archivo de Excel
        companies.forEach(company => {
        worksheet.addRow({
            name: company.name,
            category: company.category,
            impactLevel: company.impactLevel,
            yearsInBusiness: company.yearsInBusiness,
            status: company.status ? 'Active' : 'Inactive'
        })
        })

        // Generar el archivo Excel en memoria
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=companies_report.xlsx')

        // Escribir el archivo Excel y enviarlo al cliente
        await workbook.xlsx.write(res)
        res.end()
    } catch (err) {
        console.error('Error generating report:', err)
        res.status(500).json(
            { 
                message: 'Error generating report', 
                error: err.message 
            }
        )
    }
}
