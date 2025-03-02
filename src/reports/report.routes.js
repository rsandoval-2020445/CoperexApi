import { Router } from 'express'
import { generateReport } from './report.controller.js'

const router = Router()

// Ruta para generar el reporte de empresas
router.get('/generate', generateReport)

export default router
