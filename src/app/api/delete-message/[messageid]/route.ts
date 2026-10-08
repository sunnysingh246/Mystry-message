import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";


export async function DELETE(requret: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "NOT authenticated"
        }, { status: 401 })
    }

    try {
        const updatedResult = await userModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 401 })
        }

        return Response.json({
            success: false,
            message: "Message deleted"
        }, { status: 201 })

    } catch (error) {
        console.log("Error in deleting messages", error)
        return Response.json({
            success: false,
            message: "Error while deleting messages"
        }, { status: 500 })
    }
}

