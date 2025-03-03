import mongoose from "mongoose"
import { encrypt } from "../../utils/encrypt.js" // Usar argon2 para encriptar la contraseña

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
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"] 
    },
    password: { 
      type: String, 
      required: true, 
      minLength: [8, "Password must be at least 8 characters"],
      maxLength: [100, "Password can't exceed 100 characters"]
    },
    phone: { 
      type: String, 
      required: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"] 
    },
    role: { 
      type: String, 
      required: true, 
      uppercase: true, 
      enum: ["ADMIN", "USER"]
    },
    status: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
)

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject()
  return user
}

// Encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await encrypt(this.password)  // Usamos argon2 para encriptar
  }
  next()
})

const User = mongoose.model("User", UserSchema)

export default User
