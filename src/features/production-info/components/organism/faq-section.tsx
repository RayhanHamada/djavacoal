"use client";
import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="overflow-hidden rounded-md border border-[#4A4A4A] transition-all duration-300">
            {/* Pertanyaan */}
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-300 ${
                    open ? "bg-[#6C694E]" : "bg-[#333D43] hover:bg-[#35362D]"
                }`}
                aria-expanded={open}
            >
                <span className="text-sm font-semibold text-white md:text-base">
                    {q}
                </span>
                <span
                    className={`text-lg font-bold transition-transform duration-300 ${
                        open ? "rotate-90 text-white" : "text-[#EFA12D]"
                    }`}
                >
                    {open ? "−" : "+"}
                </span>
            </button>

            {/* Jawaban */}
            {open && (
                <div className="border-t border-[#2B2B2B] bg-[#35362D] px-4 pt-2 pb-4 text-sm leading-relaxed text-[#EAEAEA] md:text-base">
                    <div dangerouslySetInnerHTML={{ __html: a }} />
                    <div className="mt-3 flex justify-center">
                        <Image
                            src="/svgs/logo.svg"
                            alt="Djavacoal Watermark"
                            width={100}
                            height={40}
                            className="opacity-85"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FAQSection() {
    return (
        <section id="faq" className="scroll-mt-28 rounded-xl bg-[#222222]">
            {/* Header */}
            <header className="mb-6 px-6 pt-4">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        FAQ
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    Frequently Ask Question
                </h2>
                <div className="mt-4 h-[1px] bg-[#3A3A3A]" />
            </header>

            {/* FAQ List */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3 px-4 pb-8 md:px-6"
            >
                <FAQItem
                    q="Can I visit your factory?"
                    a="Yes, we welcome our clients to visit our factories in Java, Indonesia. We believe in transparency and building trust, so you are invited to see our production process, quality control, and packaging system firsthand. Please schedule your visit in advance so we can prepare accordingly."
                />
                <FAQItem
                    q="Can you produce hookah/shisha coals with my brand?"
                    a="Yes, we offer OEM and private label services. We can customize the briquette shape, size, packaging design, and branding to match your company’s identity and market strategy."
                />
                <FAQItem
                    q="What is your guarantee?"
                    a="We guarantee that all products are manufactured under strict quality control standards. Every order is inspected before shipment to ensure consistent quality, proper packaging, and compliance with international standards."
                />
                <FAQItem
                    q="How can I be sure that all my orders will be of the same quality?"
                    a="Our production process follows strict QC procedures at every stage: raw material selection, carbonization, mixing, briquetting, drying, and packaging. We also conduct laboratory tests to verify ash content, calorific value, and moisture levels. This ensures every shipment maintains the same quality standard."
                />
                <FAQItem
                    q="What are your Payment Terms?"
                    a="We currently accept T/T (Telegraphic Transfer). A deposit is required before production, and the balance must be settled before shipment."
                />
                <FAQItem
                    q="What is your production and delivery time?"
                    a="Production time depends on order size and packaging requirements. On average, production takes about 3–5 weeks. Shipping duration varies depending on the destination country, usually between 2–6 weeks."
                />
                <FAQItem
                    q="How to order?"
                    a="You can place an order by contacting us directly through our website, email, or WhatsApp. Our sales team will guide you through the process, from product selection to packaging options, payment, and shipment arrangements."
                />
                <FAQItem
                    q="What is your production capacity?"
                    a="Our current production capacity is approximately 250 tons per month, supported by three factories across Java, Indonesia. This allows us to meet both small and large-scale orders consistently."
                />
                <FAQItem
                    q="How can I get a sample?"
                    a="We provide samples upon request. Shipping costs for samples are usually covered by the buyer. Please contact us with your sample request and delivery details."
                />
                <FAQItem
                    q="Do you provide customized packaging?"
                    a="Yes, we offer a wide range of packaging options, including full packaging (inner plastic, inner box, master box), bulk packaging, and bulk loose packaging. We also provide custom branding and design services for private label clients."
                />
                <FAQItem
                    q="Which countries have you exported to?"
                    a="We have exported to more than 20 countries worldwide, including Saudi Arabia, Lebanon, Iraq, Turkey, Japan, Korea, Germany, USA, Brazil, Australia, and many more."
                />
                <FAQItem
                    q="Do you provide laboratory test reports?"
                    a="Yes, we can provide lab test results that verify ash content, fixed carbon, moisture level, and calorific value to ensure our products meet international standards."
                />
                <FAQItem
                    q="Are your products eco-friendly?"
                    a="Yes, our charcoal products are made from natural and renewable resources such as coconut shells, sawdust, and hardwood. They burn cleanly, produce minimal ash, and do not contain harmful chemicals."
                />
                <FAQItem
                    q="What is the delivery time for Coconut Charcoal Briquettes?"
                    a={`<p>
  We ship coconut charcoal briquettes from Semarang (Tanjung Emas, IDSRG) and Surabaya (Tanjung Perak, IDSUB), Indonesia. 
  Transporting containers from our factories to the port typically takes 12–18 hours by truck. 
  Vessel departures are usually scheduled on Thursday, Friday, and Saturday, with CY Closing on Monday, Wednesday, and Friday.
  </p>
  <p class="mt-2">Estimated transit time of containers from Semarang (IDSRG) to major ports:</p>
  <ul class="list-disc ml-6 mt-2 space-y-1">
    <li>Port Klang (MYPKG): 3–5 days</li>
    <li>Jeddah (SAJED): 22–32 days</li>
    <li>Port Said (EGPSD/E): 19–23 days</li>
    <li>Barcelona (ESBCN): 25–30 days</li>
    <li>Rotterdam (NLRTM): 25–30 days</li>
    <li>Hamburg (DEHAM): 24–29 days</li>
    <li>Antwerp (BEANER): 25–30 days</li>
    <li>Gdynia (PLGDY): 40–45 days</li>
    <li>St. Petersburg (RULED): 40–45 days</li>
    <li>Novorossiysk (RUNVS): 30–45 days</li>
    <li>Los Angeles (USLAX): 30–36 days</li>
    <li>New York (USNYC): 34–41 days</li>
    <li>Melbourne (AUMEB): 18–35 days</li>
  </ul>`}
                />
            </motion.div>
        </section>
    );
}
