import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";


export async function GET(_request: Request) {
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
        const foundUser = await userModel.findById(user._id).select("messages");

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            messages: foundUser.messages ?? []
        }, { status: 200 });
    } catch {
        return Response.json({
            success: false,
            message: "Failed to get messages"
        }, { status: 500 });
    }
}
