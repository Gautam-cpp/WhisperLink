// import { toast } from "@/hooks/use-toast";
import { prisma } from "@/lib/prisma";

export async function POST(req:Request) {
    const {username, content} = await req.json();
    try {
        const user = await prisma.user.findUnique({ 
            where: { username }
        });
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 400})
        }
        if(!user.isAcceptingMessage){
            
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            },{status: 400})
           
        }
        await prisma.message.create({
            data: {
                content: content,
                user: {
                    connect: { id: user.id }
                },
                createdAt: new Date()

            }
        })
        
        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{status: 200})
        
    } catch (e) {
        console.error("Error sending message", e);
        return Response.json({
            success: false,
            message:  "Error sending message"
        },{status: 500})
    }
}