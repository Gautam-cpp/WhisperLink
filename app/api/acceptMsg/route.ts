import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; 
import { prisma } from "@/lib/prisma";
// import { User } from "next-auth";

export async function POST(req:Request) {
    const session = await getServerSession(authOptions);
    // FIXME:
    const user = session?.user;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 401})
    }

    const userId = parseInt(user.id, 10);
    const {acceptMessages} = await req.json();
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isAcceptingMessage : acceptMessages
            },
            
        })

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 400})
        }


        return Response.json({
            success: true,
            message: "Accepting-Message  Updated Successfully"
        },{status: 200})


    } catch (e) {
        // console.error("Error updating user", e);
        if (e instanceof Error) {
            console.error("Error finding user", e.message, e.stack);
        } else {
            console.error("Unexpected error", e);
        }
        return Response.json({
            success: false,
            message: "Error updating user"
        },{status: 500})
    }
}


export async function GET() {
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 401})
    }

    const user = session.user;
    const userId = parseInt(user.id, 10);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 400})
        }

        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessage: user.isAcceptingMessage
        },{status: 200})

    } catch (e) {
        // console.error("Error fetching user", e);
        if (e instanceof Error) {
            console.error("Error finding user", e.message, e.stack);
        } else {
            console.error("Unexpected error", e);
        }
        return Response.json({
            success: false,
            message: "Error fetching user"
        },{status: 500})
    }
}