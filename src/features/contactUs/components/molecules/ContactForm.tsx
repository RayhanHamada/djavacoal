import { ContactInput } from "../atoms/ContactInput";
import { ContactTextarea } from "../atoms/ContactTextarea";
import { ContactButton } from "../atoms/ContactButton";

export function ContactForm() {
  return (
    <form className="w-full flex flex-col gap-4">
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
