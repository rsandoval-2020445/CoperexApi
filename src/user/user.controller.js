import { validationResult } from "express-validator"
import User from "./user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Crear usuario
export const createUser = async (req, res) => {
  try {
    // Validar los datos con express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }) // Si hay errores, devolverlos
    }

    const { name, surname, email, username, password, phone, role, status } = req.body

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name, surname, email, username, password: hashedPassword, phone, role, status
    })

    await newUser.save() // Guardar el usuario en la base de datos
    res.status(201).json({ message: "User created successfully", user: newUser })
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message }) // Error si no se pudo crear el usuario
  }
}

// Login de usuario (solo ADMIN)
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Buscar el usuario por nombre de usuario
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: "Invalid username or password" })

    // Verificar la contraseña utilizando bcrypt
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ message: "Invalid username or password" })

    // Generar token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" })
    res.status(200).json({ message: "Login successful", token })
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message })
  }
}
