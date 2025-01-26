import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { prisma } from "@/lib/prisma";




export const authOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email..." },
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials:any):Promise<any | null> {
                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.identifier },
                                { username: credentials.identifier }
                            ]
                        }
                    });

                    if(!user){
                        throw new Error('No user found with this username or email')
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error('Incorrect Password')
                    }
                } catch (e) {
                    console.error("Error authorizing user", e);
                }
            }

        })
    ],
    secret: process.env.NEXTAUTH_SECRET_KEY,

    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token.id = user.id?.toString();
                token.isVerified = user.isVerified;
                token.isVerified = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user.id = token.id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        }
    }

}