import { ContactButton } from "../atoms/contact-button";
import { ContactInput } from "../atoms/contact-input";
import { ContactTextarea } from "../atoms/contact-textarea";

export function ContactForm() {
    return (
        <form className="flex w-full flex-col gap-4">
            <ContactInput label="Full Name:" placeholder="Full Name" />
            <ContactInput label="E-mail:" type="email" placeholder="E-mail" />
            <ContactInput label="Phone Number:" placeholder="Phone Number" />
            <ContactTextarea label="Message:" placeholder="Message" />
            <div className="mt-2">
                <ContactButton text="Send" />
            </div>
        </form>
    );
}
