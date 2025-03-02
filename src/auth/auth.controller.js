import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../user/user.model.js"

// Registrar un nuevo usuario (solo ADMIN)
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, name, surname, phone } = req.body

    // Verificar si ya existe un usuario con ese username o email
    const userExists = await User.findOne({ $or: [{ username }, { email }] })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      name,
      surname,
      phone,
      role: "ADMIN", // Como estamos creando un solo rol, será ADMIN
    })

    await newUser.save()
    res.status(201).json({ message: "Admin user created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message })
  }
}

// Login de usuario (solo ADMIN)
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Comparar la contraseña
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" })

    res.json({ message: "Login successful", token })
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message })
  }
}
