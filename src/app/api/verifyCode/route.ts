import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { z } from "zod"
import { userNameValidation } from "@/schemas/signUpSchema"


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await userModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified === true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        }
        
         else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired.Please signup again for new code"
            })
        }
        else {
            return Response.json({
                success: false,
                message: "Incorrect verificatin code"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("Error verifying user")
        return Response.json({
            success: true,
            message: "Error verifying user"
        }, { status: 500 })
    }
}