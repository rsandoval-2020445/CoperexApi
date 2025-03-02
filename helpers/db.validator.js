// Validaciones en relación a la BD
import User from "../src/user/user.model.js"
import { isValidObjectId } from "mongoose"

// Validar si el nombre de usuario ya existe
export const existUsername = async (username) => {
    const alreadyUsername = await User.findOne({ username })
    if (alreadyUsername) {
        throw new Error(`Username ${username} is already taken`)
    }
}

// Validar formato de ObjectId
export const ObjectIdValid = async (objectId) => {
    if (!isValidObjectId(objectId)) {
        throw new Error(`Invalid ObjectId format`)
    }
}
