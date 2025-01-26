import { NextResponse } from "next/server";
import type {NextRequest} from "next/server"
import { getToken } from "next-auth/jwt";

export {default} from 'next-auth/middleware'

export async function middleware(req:NextRequest){
    const token = await getToken({req: req})
    const url = req.nextUrl

    if(token && (
        url.pathname.startsWith('/signin') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')
    ))
    return NextResponse.redirect(new URL('/dashboard', req.url))

    if(!token && url.pathname.startsWith('/dasboard')){
        return NextResponse.redirect(new URL('/signin', req.url))
    }
}

export const config = {
    matcher: ['/signin', '/signup', '/', '/dashboard/:path*', '/verify/:path']
}