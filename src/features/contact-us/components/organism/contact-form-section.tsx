import { ContactMap } from "../molecules/contact-map";
import { ContactForm } from "../molecules/contact-form";

export function ContactFormSection() {
  return (
    <section className="bg-[#1C1C1C] text-white pb-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8 lg:flex-row lg:justify-between">
        {/* Map */}
        <div className="flex-1">
          <div className="w-full aspect-[3/2] md:aspect-[4/3] rounded-lg overflow-hidden">
            <ContactMap />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-start">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
