import { hash, verify } from "argon2" 

export const encrypt = async (password) => {
    try {
      return await hash(password)  // Encriptar la contraseña
    } catch (err) {
      console.error("Error encrypting password:", err)
      throw new Error("Error encrypting password")
    }
  }

// Verificar la contraseña al iniciar sesión
export const checkPassword = async (hashedPassword, password) => {
    try {
        return await verify(hashedPassword, password) 
    } catch (err) {
        console.error("Error verifying password:", err)
        return err
    }
}
