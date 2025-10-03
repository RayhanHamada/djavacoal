import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function VisitorFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-gray-200 
             bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/images/bg-footer.png')] 
             bg-cover bg-center ">
      
      {/* Top Section */}
      <div
        className="max-w-7xl mx-auto px-6 py-10 
                   grid grid-cols-1 gap-10 
                  lg:grid-cols-4"
      >
        {/* Logo & Social Media */}
        <div className="flex flex-col items-start md:items-center grid-cols-2">
          <Image
            src="/svgs/logo.svg"
            alt="Logo Djavacoal"
            width={160}
            height={100}
            className="h-auto w-auto "
          />
          <div className="flex space-x-3">
            <Link href="#" className="p-2 bg-gray-700 hover:bg-gray-500">
              <FaFacebookF size={16} />
            </Link>
            <Link href="#" className="p-2 bg-gray-700 hover:bg-gray-500">
              <FaLinkedinIn size={16} />
            </Link>
            <Link href="#" className="p-2 bg-gray-700 hover:bg-gray-500">
              <FaInstagram size={16} />
            </Link>
            <Link href="#" className="p-2 bg-gray-700 hover:bg-gray-500">
              <FaTiktok size={16} />
            </Link>
          </div>
        </div>

        {/* Company + Products */}
        <div className="flex flex-col-2 gap-6 md:flex-row md:justify-between">
          {/* Company */}
          <div className="md:w-1/2">
            <h3 className="text-orange-400 font-semibold mb-2 border-b-2 border-orange-400 pb-1">
              Company
            </h3>
            <ul className="space-y-2 text-sm mt-3">
              <li><Link href="#">CV. Djavacoal Indonesia</Link></li>
              <li><Link href="#">Djavacoal’s Team</Link></li>
              <li><Link href="#">Legal & Certificate</Link></li>
              <li><Link href="#">Factory</Link></li>
              <li><Link href="#">Our Gallery</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="md:w-1/2">
            <h3 className="text-orange-400 font-semibold mb-2 border-b-2 border-orange-400 pb-1">
              Products
            </h3>
            <ul className="space-y-2 text-sm mt-3">
              <li><Link href="#">Coconut Shell Charcoal Briquette</Link></li>
              <li><Link href="#">Barbeque Charcoal Briquette</Link></li>
              <li><Link href="#">Sawdust Charcoal Briquette</Link></li>
              <li><Link href="#">Natural Wood Charcoal Briquette</Link></li>
              <li><Link href="#">Djavacoal’s Brand</Link></li>
            </ul>
          </div>
        </div>


        {/* Quick Link + Contact */}
        <div className="flex flex-col md:flex-row md:justify-between md:gap-3 lg:col-span-2">
          
          {/* Quick Link */}
          <div className="md:w-1/2">
            <h3 className="text-orange-400 font-semibold mb-2 pb-1 border-b-2 border-orange-400 w-38 md:w-full lg:w-36">
              Quick Link
            </h3>
            <ul className="space-y-2 text-sm mt-3">
              <li><Link href="#">Production Process</Link></li>
              <li><Link href="#">Shipment Terms</Link></li>
              <li><Link href="#">MOQ & Payment Terms</Link></li>
              <li><Link href="#">Packaging Info</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">News & Article</Link></li>
            </ul>
          </div>
          <div></div>
          {/* Contact */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <h3 className="font-semibold mb-2 pb-1">
              Contact Us
            </h3>
            <div className="text-sm space-y-3 mt-3">
              <p className="flex items-start gap-2">
                <FaMapMarkerAlt className="w-7 h-4 mt-1" />
                PT TAIBA COCOCHA INDONESIA Jl. PWRI No.53, RT.1/RW.6, Tonjong,
                Tajur Halang, Bogor, Jawa Barat 16320, Indonesia
              </p>
              <p>Phone :</p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="w-3 h-4" /> +62 821 2285 9318
              </p>
              <p>E-mail :</p>
              <p className="flex items-center gap-2">
                <HiOutlineMail className="w-5 h-4" /> marketing@djavacoal.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative py-4 text-center text-xs text-white">
        <div className="absolute inset-0 bg-[#EFA12D]/100"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <span className="relative z-10">
          © {year} · CV. Djavacoal Indonesia
        </span>
      </div>
    </footer>
  );
}
