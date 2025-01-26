import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; 
import { prisma } from "@/lib/prisma";


export async function GET() {
    const session = await getServerSession(authOptions);
    const user = session?.user; 

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 401})
    }

    const userId = parseInt(user.id, 10);
    try {
        const fetchedUser =await prisma.user.findUnique({
            where: { id: userId },
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
              },
            },
        });
        
        if(!fetchedUser || (Array.isArray(user) && user.length === 0)){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 400})
        }

        return Response.json({
            success: true,
            messages: fetchedUser.messages.map(msg => ({
                ...msg,
                createdAt: msg.createdAt.toISOString(),
            }))
        }, { status: 200 });


        

    } catch (e) {
        if (e instanceof Error) {
            console.error("Error finding user", e.message, e.stack);
        } else {
            console.error("Unexpected error", e);
        }

        return Response.json({
            success: false,
            message: "Error finding user"   
        },{status: 500})
    }
}