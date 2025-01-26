import {prisma} from "@/lib/prisma"
import {z} from "zod"
import { usernameValidation } from "@/schema/signUpSchema"

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req:Request) {
    try{
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors
            }, {status: 400})

        }
        const {username} = result.data
        const existingVerifiedUser = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        })

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is already taken',
            }, {status:400})
        }

        return Response.json({
            success: true,
            message: 'Username Available',
        }, {status:200})
    } catch (e){
        console.error("Error checking username", e);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
    }
    
}