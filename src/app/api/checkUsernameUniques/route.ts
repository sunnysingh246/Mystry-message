import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { success, z } from "zod"
import { userNameValidation } from "@/schemas/signUpSchema"


const userNameQuerrSchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    //TODO:use this in all other routes
    if (request.method !== 'GET') {
        return Response.json({
            success: false,
            message: "Method is not allowed"
        }, { status: 405 })
    }

    //localhost: 3000 / api / cuu ? username = "someone"

    try {
        const { searchParams } = new URL(request.url)
        const querryParams = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = userNameQuerrSchema.safeParse(querryParams)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(',')
                    : "Invalid qurrey params"
            }, { status: 400 })
        }

        const { username } = result.data

        const existingAndVerifiedUser = await userModel.findOne(
            { username, isVerified: true }
        )

        if (existingAndVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken by someone try another"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username is unique you can go for this username"
        }, { status: 200 })

    } catch (error) {
        console.error("Error while checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error while checking username"
            }, { status: 500 }
        )
    }
}