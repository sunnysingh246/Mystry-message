import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod";



export async function GET(requret: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "NOT authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await userModel.aggregate([

            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: user[0].message
        })

    } catch (error) {
        console.log("AN unexpected error", error)
        return Response.json({
            success: false,
            message: "Failed to get messages"
        }, { status: 500 })
    }
}
