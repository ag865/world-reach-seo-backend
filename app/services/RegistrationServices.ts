import { UserServices } from "./index.js"

const registerEmail = async (email: string) => {
    const user = await UserServices.getUserByValue('email', email)
}
