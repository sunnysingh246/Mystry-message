import { z } from 'zod'

export const messagesSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Content must be of atleast of 10 character" })
        .max(300, { message: "Content should not more than 300 character" })
})