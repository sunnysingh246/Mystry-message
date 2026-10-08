import userModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/user.model";


export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await userModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "Failed to get user"
            }, { status: 404 });
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not acepting the messages"
            }, { status: 403 });
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 201 });
    } catch {
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}