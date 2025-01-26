



import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: Request){
    try{
        const {username, email, password} = await req.json();

        // check if  the username is taken or not 
        const doesUsernameExist = await prisma.user.findFirst({
            where: {
                username: username,
                isVerified: true
            }
        });
        if(doesUsernameExist){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        // check if the email is already in use or not
        const doesEmailExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        if(doesEmailExist && doesEmailExist.isVerified){
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);

            if(!emailResponse.success){
                return Response.json({
                    success: false,
                    message: emailResponse.message
                }, {status: 500})
            }
            await prisma.user.update({
                where: {
                    email 
                },
                data: {
                    verifyCode
                }
            })
            return Response.json({
                success: false,
                message: "verification email sent again"
            }, {status: 200})

        }else{
            // if user doesn't exist than create user in db
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1)

            await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    
                }
            })
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User Registered Successfully"
        }, {status: 200})


    }
    catch(error){
        console.error('Error registering user', error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {status: 500})
    }
}