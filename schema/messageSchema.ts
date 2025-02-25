import {z} from "zod"


export const messageSchema = z.object({
    content: z.string().min(5).max(300)

})