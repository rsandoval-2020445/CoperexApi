import mongoose from "mongoose"
import { encrypt } from "../../utils/encrypt.js"  // Función para encriptar la contraseña

const UserSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            maxLength: 25 
        },
        surname: { 
            type: String, 
            required: true, 
            maxLength: 25 
        },
        username: { 
            type: String, 
            required: true, 
            unique: true, 
            maxLength: 15 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true, 
            minLength: 8, 
            maxLength: 100 
        },
        phone: { 
            type: String, 
            required: true, 
            minLength: 8,
            maxLength: 13 
            },
        role: { 
            type: String, 
            required: true, 
            uppercase: true, 
            enum: ["ADMIN"] 
        }, // Solo ADMIN
        status: { 
            type: Boolean, 
            default: true 
        }
    }
)

// Método para crear un ADMIN inicial si no existe
UserSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject()  // No retornar la contraseña
    return user
}

// Crear un administrador inicial
const createMainAdmin = async () => {
    try {
        const mainAdminExists = await User.findOne({ role: "ADMIN" })
        if (!mainAdminExists) {
        const hashedPassword = await encrypt("Password123!")
        const mainAdmin = new User(
            {
                name: "Raúl",
                surname: "Sandoval",
                username: "rsandoval",
                email: "rsandoval@gmail.com",
                password: hashedPassword,
                phone: "40918656",
                role: "ADMIN",
            }
        )
        await mainAdmin.save()
        console.log("Main ADMIN created successfully")
        }
    } catch (err) {
        console.error("Error creating main ADMIN:", err)
    }
}

// Ejecutar la creación del ADMIN solo la primera vez
createMainAdmin()

const User = mongoose.model("User", UserSchema)

export default User
