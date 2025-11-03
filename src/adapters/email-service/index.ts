import { Resend } from "resend";

export function getResend(apiKey: string) {
    return new Resend(apiKey);
}
