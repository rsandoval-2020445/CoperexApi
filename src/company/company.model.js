import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true
        },
        category: {
            type: String,
            required: true
        },
        impactLevel: {
            type: String,
            required: true
        },
        yearsInBusiness: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date, 
            default: Date.now
        }
    }
)

export default mongoose.model('Company', CompanySchema)