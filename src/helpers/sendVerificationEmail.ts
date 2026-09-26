import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Mystry message | verification code",
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return { success: true, message: "Verification code sent successfully " }
    }
    catch (emailError) {
        console.log("Error sending verification code", emailError)
        return { success: false, message: "failed to send email verification" }
    }
}
