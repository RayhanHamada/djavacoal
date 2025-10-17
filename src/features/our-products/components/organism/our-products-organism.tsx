"use client";
import React, { useState } from "react";
import { Download, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export function ProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [
    "/api/placeholder/400/400",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
  ];

  const shapes = [
    {
      name: "CUBE",
      sizes: [
        "22x22x22 - (96 pcs/kg)",
        "25x25x25 - (72 pcs/kg)",
        "26x26x26 - (64 pcs/kg)",
        "27x27x27 - (54 pcs/kg)",
        "28x28x28 - (50 pcs/kg)",
      ],
    },
    {
      name: "FLAT",
      sizes: [
        "25x25x17 - (108 pcs/kg)",
        "25x25x15 - (120 pcs/kg)",
        "20x20x20 - (130 pcs/kg)",
      ],
    },
    {
      name: "HEXA",
      sizes: [
        "18x50 - (72 pcs/kg)",
        "25x35 - (96 pcs/kg)",
        "20x42 - (88 pcs/kg)",
      ],
    },
    {
      name: "STICK",
      sizes: [
        "18x50 - (72 pcs/kg)",
        "25x35 - (96 pcs/kg)",
        "25x40 - (66 pcs/kg)",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-h1">
      {/* Hero Section */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-center">
            Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <img
                src={productImages[selectedImage]}
                alt="Coconut Shell Charcoal Briquette"
                className="max-w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productImages.slice(1, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx + 1)}
                  className={`bg-gray-800 rounded-lg p-4 hover:ring-2 hover:ring-secondary transition ${
                    selectedImage === idx + 1 ? "ring-2 ring-secondary" : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product view ${idx + 2}`}
                    className="w-full h-auto"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl text-h1 font-bold mb-4">
                <span className="text-secondary">Coconut Shell</span> Charcoal
                Briquette
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-secondary hover:bg-secondary text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition">
                <Download size={20} />
                Catalogue
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition">
                <MessageCircle size={20} />
                Ask More
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-secondary">
                Description:
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Coconut Shell Charcoal Briquette Is An Eco-Friendly, Sustainable
                Fuel Made From The Natural Byproduct Of Coconut Shells, Known
                For Its High Calorific Value, Long Burn Time, And Low Ash
                Content. It Is Ideal For Grilling, Smoking, And Industrial
                Applications. Our Coconut Shell Charcoal Is Made From Pure
                Natural Byproduct Without Any Harmful Chemicals, Making It A
                Preferred Alternative To Traditional Wood Charcoal.
                Additionally, It's Produced Using A Renewable Resource,
                Contributing To Environmental Conservation While Delivering
                Efficient And Consistent Heat Output, Making It A Popular Choice
                For Both Domestic And Commercial Use Globally, Especially In The
                Shisha Market.
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-secondary">
                Specification & Lab. Test:
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <img
                  src="/api/placeholder/300/400"
                  alt="Diamond Grade Specification"
                  className="w-full rounded-lg"
                />
                <img
                  src="/api/placeholder/300/400"
                  alt="Certificate of Analysis"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shape & Size Section */}
        <div className="mt-12 bg-gray-800/50 rounded-lg p-6 lg:p-8">
          <h3 className="text-2xl font-semibold mb-6 text-secondary">
            Shape & Size:
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shapes.map((shape, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                  <h4 className="font-semibold text-lg">{shape.name}:</h4>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  {shape.sizes.map((size, sIdx) => (
                    <li key={sIdx}>{size}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Information */}
        <div className="mt-12 bg-gray-800/50 rounded-lg overflow-hidden">
          <h3 className="text-2xl font-semibold p-6 text-secondary">
            Detail Information:
          </h3>
          <div className="divide-y divide-gray-700">
            <div className="grid sm:grid-cols-3 p-4 hover:bg-gray-700/30 transition">
              <span className="font-semibold text-gray-400">MOQ:</span>
              <span className="sm:col-span-2">20' Container (18 Tons)</span>
            </div>
            <div className="grid sm:grid-cols-3 p-4 hover:bg-gray-700/30 transition">
              <span className="font-semibold text-gray-400">Packaging:</span>
              <span className="sm:col-span-2 text-blue-400">
                pail / Bulk / Bulk Load
              </span>
            </div>
            <div className="grid sm:grid-cols-3 p-4 hover:bg-gray-700/30 transition">
              <span className="font-semibold text-gray-400">
                Payment Terms:
              </span>
              <span className="sm:col-span-2 text-blue-400">
                L/C, T/T, (DP)
              </span>
            </div>
            <div className="grid sm:grid-cols-3 p-4 hover:bg-gray-700/30 transition">
              <span className="font-semibold text-gray-400">
                Shipment Terms:
              </span>
              <span className="sm:col-span-2 text-blue-400">
                Freight On Board (FOB)
              </span>
            </div>
            <div className="grid sm:grid-cols-3 p-4 hover:bg-gray-700/30 transition">
              <span className="font-semibold text-gray-400">
                Production Capacity:
              </span>
              <span className="sm:col-span-2">250 Tons/Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h4 className="text-secondary font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    CV. Djavacoal Indonesia
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Djavacoal's Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Legal & Certificate
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Our Facilities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Our Gallery
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-secondary font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Coconut Shell Charcoal Briquette
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Barbeque Charcoal Briquette
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Sawdust Charcoal Briquette
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Natural Wood Charcoal Briquette
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Djavacoal's Brand
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Link */}
            <div>
              <h4 className="text-secondary font-semibold mb-4">Quick Link</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Production Process
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Shipment Process
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    MDQ & Payment Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Package & Stock
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    News & Article
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-secondary font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <p>
                    JI. TABA CICICIUS-INDOMEBU, PADI BUYUANG, TEUNOM ACEH JAYA,
                    ACEH, INDONESIA. 23662
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <p>+62 821 2285 9318</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <p>marketing@djavacoal.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © Copyright 2025 - CV. Djavacoal Indonesia
          </div>
        </div>
      </footer>
    </div>
  );
}
