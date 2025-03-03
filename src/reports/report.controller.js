import ExcelJS from "exceljs"
import Company from "../company/company.model.js"
import { fileURLToPath } from "url"
import path from "path"

export const generateReport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Companies Report")

    worksheet.columns = [
      { header: "Company Name", key: "name", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Impact Level", key: "impactLevel", width: 20 },
      { header: "Years in Business", key: "yearsInBusiness", width: 20 },
      { header: "Status", key: "status", width: 15 }
    ]

    const companies = await Company.find()

    companies.forEach((company) => {
      worksheet.addRow({
        name: company.name,
        category: company.category,
        impactLevel: company.impactLevel,
        yearsInBusiness: company.yearsInBusiness,
        status: company.status ? "Active" : "Inactive"
      })
    })

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    // Sobrescribir el archivo Excel cada vez que se genere el reporte
    const filePath = path.join(__dirname, "../../public", "companies_report.xlsx")

    await workbook.xlsx.writeFile(filePath)

    // Configurar los encabezados para la descarga del archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", "attachment; filename=companies_report.xlsx")

    // Leer y enviar el archivo
    res.sendFile(filePath)
  } catch (err) {
    console.error("Error generating report:", err)
    res.status(500).json({
      message: "Error generating report",
      error: err.message
    })
  }
}
