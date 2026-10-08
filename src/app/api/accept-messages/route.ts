import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;

    if (!session || !session.user || !user?._id) {
        return Response.json({
            success: false,
            message: "NOT Authenticated"
        }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        }, { status: 200 });
    } catch {
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;

    if (!session || !session.user || !user?._id) {
        return Response.json({
            success: false,
            message: "NOT Authenticated"
        }, { status: 401 });
    }

    try {
        const foundUser = await userModel.findById(user._id).select("isAcceptingMessages");

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to find user"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages,
        }, { status: 200 });
    } catch {
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 });
    }
}

