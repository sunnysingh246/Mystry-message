import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { } from '@/types/next-auth'



export const authOptinos: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credientials",
            name: "Credientials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "password", type: " password " },
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { password: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Invalid credientials")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username

            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}