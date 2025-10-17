import Plunk from "@plunk/node";
import { Resend } from "resend";

export function getPlunk(apiKey: string) {
    return new Plunk(apiKey);
}

export function getResend(apiKey: string) {
    return new Resend(apiKey);
}
