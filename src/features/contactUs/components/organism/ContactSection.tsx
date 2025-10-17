import Image from "next/image";
import { ContactInfoItem } from "../molecules/ContactInfoItem";
import { ContactSocial } from "../molecules/ContactSocial";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="relative bg-[#1C1C1C] text-white">
      {/* Header Section */}
      <div className="relative w-full bg-[#1C1C1C] text-white overflow-hidden">
        {/* Background Image */}
        <div className="relative w-full h-48 md:h-72">
          <Image
            src="/images/bg-banner-header.png"
            alt="Production Info Banner"
            fill
            className="object-cover object-center"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-2xl md:text-4xl font-semibold italic">
              Contact Us
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Logo */}
        <div className="flex flex-col items-center md:w-1/2">
          <Image
            src="/svgs/logoContactUs.svg"
            alt="Djavacoal Logo"
            width={300}
            height={120}
            className=""
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6 md:w-1/2">
          <ContactInfoItem
            icon={<FaEnvelope />}
            label="E-Mail"
            value="admin@djavacoal.com"
          />
          <ContactInfoItem
            icon={<FaPhoneAlt />}
            label="Phone"
            value="+62 821-2285-9318"
          />
          <ContactInfoItem
            icon={<FaMapMarkerAlt />}
            label="Location"
            value={
              <>
                Jl. Vihara Jin Ku Poh Kp. Jati RT.002 RW.006 Tonjong,
                Tajurhalang, Bogor Regency, West Java 16320
              </>
            }
          />
          <ContactSocial />
        </div>
      </div>
    </section>
  );
}
