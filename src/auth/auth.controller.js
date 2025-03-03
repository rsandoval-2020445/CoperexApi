import User from "../user/user.model.js"
import jwt from "jsonwebtoken"
import { checkPassword } from "../../utils/encrypt.js"

// Registrar un nuevo usuario (solo ADMIN)
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, name, surname, phone } = req.body

    // Verificar si ya existe un usuario con ese username o email
    const userExists = await User.findOne({ $or: [{ username }, { email }] })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Encriptar la contraseña con bcrypt
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

    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Verificar la contraseña usando argon2
    const validPassword = await checkPassword(user.password, password)  // Comparar con argon2
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Si el usuario y la contraseña son correctos, generar un JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" })

    res.status(200).json({
      message: "Login successful",
      token,  // Enviar el token JWT
    })
  } catch (err) {
    console.error("Error logging in:", err)
    res.status(500).json({ message: "Error logging in", error: err.message })
  }
}
