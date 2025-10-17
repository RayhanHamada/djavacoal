import { ContactForm } from "../molecules/contact-form";
import { ContactMap } from "../molecules/contact-map";

export function ContactFormSection() {
    return (
        <section className="bg-[#1C1C1C] pb-10 text-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:flex-row lg:justify-between">
                {/* Map */}
                <div className="flex-1">
                    <div className="aspect-[3/2] w-full overflow-hidden rounded-lg md:aspect-[4/3]">
                        <ContactMap />
                    </div>
                </div>

                {/* Form */}
                <div className="flex flex-1 flex-col justify-start">
                    <ContactForm />
                </div>
            </div>
        </section>
    );
}
