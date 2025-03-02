import mongoose from "mongoose";
import { encrypt } from "../../utils/encrypt.js"; // Si usas 'argon2' u otro

// Definir el esquema del modelo de usuario
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxLength: [25, "Can't exceed 25 characters"]
  },
  surname: {
    type: String,
    required: [true, "Surname is required"],
    maxLength: [25, "Can't exceed 25 characters"]
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    maxLength: [15, "Can't exceed 15 characters"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters"],
    maxLength: [100, "Password can't exceed 100 characters"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    maxLength: [13, "Can't exceed 13 characters"],
    minLength: [8, "Phone number must be at least 8 characters"]
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    uppercase: true,
    enum: ["ADMIN", "CLIENT"]
  },
  status: {
    type: Boolean,
    default: true
  }
});

// Crear el modelo User
const User = mongoose.model("User", UserSchema);

// Crear un admin principal si no existe
const createMainAdmin = async () => {
  try {
    const mainAdminExists = await User.findOne({ role: "ADMIN" });
    if (!mainAdminExists) {
      const hashedPassword = await encrypt("Password123!"); // Usar argon2 o bcrypt
      const mainAdmin = new User({
        name: "Raúl",
        surname: "Sandoval",
        username: "rsandoval",
        email: "rsandoval@gmail.com",
        password: hashedPassword,
        phone: "40918656",
        role: "ADMIN",
      });
      await mainAdmin.save();
      console.log("Main ADMIN created successfully");
    }
  } catch (err) {
    console.error("Error creating main ADMIN:", err);
  }
};

// Ejecutar la creación del ADMIN solo la primera vez
createMainAdmin();

export default User;
