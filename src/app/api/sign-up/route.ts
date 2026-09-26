import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    const existingUserVerfiedByUsername = await userModel.findOne({
        userName,
        isVerified: true
    })

    if (existingUserVerfiedByUsername) {
        return Response.json({
            success: false,
            message: "Username is  already taken"
        }, { status: 400 })
    }

    const existingUserByEmail = await userModel.findOne({ email })
    const verifyCode = Math.floor(10000 + Math.random() * 900000).toString()

    if (existingUserByEmail) {
        //TODO:back here
    } else {
        const hashedPassword = await bcrypt.hash(password, 10)

        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new userModel({
            userName,
            password: hashedPassword,
            email,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false
                isAcceptingMessage: true,
            messages: []
        })

        await newUser.save()

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            userName,
            verifyCode
        )
    }

    try {
        const { username, email, password } = await request.json()
    } catch (error) {
        console.log(error, "Error registering user")
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            { status: 500 }
        )
    }
}