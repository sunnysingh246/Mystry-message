import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        // Connect to database
        await dbConnect();

        // Get data from request
        const { username, email, password } = await request.json();

        // Basic validation
        if (!username || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Username, email and password are required",
                },
                { status: 400 }
            );
        }

        // Check if username already exists with a verified account
        const existingUserVerifiedByUsername =
            await userModel.findOne({
                username,
                isVerified: true,
            });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 409 }
            );
        }

        // Generate verification code
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Verification code expires after 1 hour
        const verifyCodeExpiry = new Date(
            Date.now() + 60 * 60 * 1000
        );

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if email already exists
        const existingUserByEmail = await userModel.findOne({
            email,
        });

       
        // CASE 1: Email already exists
        
        if (existingUserByEmail) {
            // If the existing account is already verified
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 409 }
                );
            }

            // Existing account is NOT verified
            // Update its information and send a new verification code
            existingUserByEmail.username = username;
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

            await existingUserByEmail.save();

            // Send verification email
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            );

            if (!emailResponse.success) {
                return Response.json(
                    {
                        success: false,
                        message: emailResponse.message,
                    },
                    { status: 500 }
                );
            }

            return Response.json(
                {
                    success: true,
                    message:
                        "Verification email sent. Please verify your email.",
                },
                { status: 200 }
            );
        }

       
        // CASE 2: New user
        
        const newUser = new userModel({
            username,
            password: hashedPassword,
            email,
            verifyCode,
            verifyCodeExpiry,
            isVerified: false,
            isAcceptingMessages: true,
            messages: [],
        });

        await newUser.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        // Successful registration
        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully. Please verify your email.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);

        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}