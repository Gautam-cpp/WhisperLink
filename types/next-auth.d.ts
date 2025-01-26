import 'next-auth'

declare module 'next-auth'{
    interface User{
        id?: String
        isVerified?: boolean
        isAcceptingMessage?: boolean
        username?: string
    }

    interface Session{
        user: {
            id?: String
            isVerified?: boolean
            isAcceptingMessage?: boolean
            username?: string
        } & DefaultSession['user']
        
    } 
}

