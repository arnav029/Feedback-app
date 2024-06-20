import {resend} from "../lib/resend";
import VerificationEmail from "../../emails/verficatinMails";


import { APIResponse } from "../types/APIResponse";

export async function sendVerificationMail(
    email: string,
    username: string,
    verifyCode : string
): Promise<APIResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true, message: 'Verification Message send successfully'}
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success: false, message: 'Failed to send verification mail'}

    }
}
 
