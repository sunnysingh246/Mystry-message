import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ messageid: string }> }
) {
    const { messageid: messageId } = await context.params;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;

    if (!session || !session.user || !user?._id) {
        return Response.json({
            success: false,
            message: "NOT authenticated"
        }, { status: 401 });
    }

    try {
        const updatedResult = await userModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message deleted"
        }, { status: 200 });
    } catch {
        return Response.json({
            success: false,
            message: "Error while deleting messages"
        }, { status: 500 });
    }
}

