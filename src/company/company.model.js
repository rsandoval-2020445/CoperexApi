import mongoose from "mongoose"

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,  // La empresa debe ser única
      minlength: [3, "Company name must be at least 3 characters"],
      maxlength: [50, "Company name can't exceed 50 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ['Tech', 'Healthcare', 'Finance', 'Retail'], // Las categorías son limitadas a estas
    },
    impactLevel: {
      type: String,
      required: [true, "Impact level is required"],
      enum: ['Low', 'Medium', 'High']  // Validación para el nivel de impacto
    },
    yearsInBusiness: {
      type: Number,
      required: [true, "Years in business is required"],
      min: [1, "Company must be in business for at least 1 year"],  // Validar que el valor sea mayor que 1
      max: [100, "Company can't have been in business for more than 100 years"]
    },
    status: {
      type: Boolean,
      default: true  // Las empresas son activas por defecto
    }
  },
  { 
    timestamps: true 
  }  // Agregar fechas de creación y actualización
)

const Company = mongoose.model("Company", CompanySchema)

export default Company
