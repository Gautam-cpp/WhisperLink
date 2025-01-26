import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise <ApiResponse>{
    console.log("I'm in otp sender")
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery message || Verification otp',
            react: VerificationEmail({username, otp: verifyCode})

          });
          if (error) {
              return {success: false, message: `${error.message || JSON.stringify(error)}`}
            }
        console.log("OTP sent successfully")
          return{success: true, message: `SuccessFully sent Verification Email ${data}`}
    } catch (emailError) {
        // console.log("Error sending Verification email", emailError)
        return{success: false, message: 'Failed to send Verification mail'}
    }
}
