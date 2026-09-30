import { z } from 'zod'

export const userNameValidation = z
    .string()
    .min(2, "Username must be atleast two character")
    .max(20, "No more than 20 character")
    .regex(/^[a-zA-Z0-9_]{3,20}$/, "Username must not contain special character")


export const signUpSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be of atleast of six character" })
})