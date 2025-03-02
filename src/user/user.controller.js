import User from "./user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Crear un usuario (solo ADMIN)
export const createUser = async (req, res) => {
    try {
        const { 
            name, 
            surname, 
            username, 
            email, 
            password, 
            phone } = req.body

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ username })
        if (userExists) {
        return res.status(400).json({ message: "User already exists" })
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear nuevo usuario
        const newUser = new User(
            {
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            phone,
            role: "ADMIN", // Solo administradores
            }
        )

        await newUser.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message })
    }
}

// Login de usuario (solo ADMIN)
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ message: "Invalid username or password" })

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).json({ message: "Invalid username or password" })

        // Generar token JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({ message: "Login successful", token })
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message })
    }
}
