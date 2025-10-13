import { env } from "@/configs";
import Plunk from "@plunk/node";

export const plunk = new Plunk(env.RESEND_API_KEY);
