"use client";
import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";
import Image from "next/image";

const ITEMS = [
  { id: "process", label: "Production Process" },
  { id: "moq", label: "MOQ & Payment Terms" },
  { id: "shipment", label: "Shipment Terms" },
  { id: "packaging", label: "Packaging Info" },
  { id: "faq", label: "FAQ" },
];

type Props = {
  idPrefix?: string;
};

export default function ProductionSidebar({ idPrefix = "" }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // pilih root scroll: desktop pakai container khusus, mobile pakai window
    const desktopContainer = document.querySelector<HTMLElement>(
      "#desktop-scroll-container"
    );
    const root = desktopContainer ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          // hilangkan prefix saat setActive agar cocok dengan ITEMS.id
          const rawId = visible.target.id.replace(idPrefix, "");
          setActive(rawId);
        }
      },
      {
        threshold: 0.3,
        root: root, // null => window
        rootMargin: "0px 0px -40% 0px",
      }
    );

    ITEMS.forEach(({ id }) => {
      const section = document.getElementById(idPrefix + id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [idPrefix]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // deteksi apakah mode desktop (lg ke atas)
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const container = document.querySelector<HTMLElement>(
      "#desktop-scroll-container"
    );

    if (isDesktop && container && container.contains(el)) {
      // 💻 Desktop: scroll di dalam container kanan
      const offsetTop = el.offsetTop;
      container.scrollTo({
        top: offsetTop - 20,
        behavior: "smooth",
      });
    } else {
      // 📱 Mobile & Tablet: scroll ke elemen di dalam window normal
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setActive(id);
    setOpen(false);
  };

  return (
    <>
      {/* MOBILE DROPDOWN */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#161616] border-b border-[#2a2a2a] flex items-center gap-3 py-3">
        <div className="text-[#EFA12D] text-xl">
          <Image
            src="/svgs/ic_select.svg"
            alt="Filter Icon"
            width={40}
            height={40}
          />
        </div>

        <div className="relative w-full">
          <button
            onClick={() => setOpen(!open)}
            className="w-full border border-[#3a3a3a] rounded-sm flex justify-between items-center px-4 py-2 text-sm text-white"
          >
            <span className="truncate">
              {active
                ? ITEMS.find((i) => i.id === active)?.label
                : "Select Topic"}
            </span>
            {open ? (
              <IoChevronUp className="text-[#EFA12D]" />
            ) : (
              <IoChevronDown className="text-[#EFA12D]" />
            )}
          </button>

          {open && (
            <div className="absolute mt-1 left-0 w-full bg-[#292D32] border border-[#3a3a3a] rounded-sm overflow-hidden">
              {ITEMS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleClick(id)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    active === id
                      ? "text-[#EFA12D] underline underline-offset-4"
                      : "text-white hover:text-[#EFA12D]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <nav className="hidden lg:block sticky top-[120px] h-fit bg-[#222222] border-y border-[#2a2a2a] w-[260px] self-start">
        <div className="overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-none">
          <div className="flex flex-col space-y-[3px]">
            {ITEMS.map(({ id, label }) => (
              <div
                key={id}
                className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#2a2a2a]/60 last:after:hidden"
              >
                <button
                  onClick={() => handleClick(id)}
                  className={`flex items-center justify-between w-full px-5 py-4 my-2 text-sm font-medium transition-all duration-200
              ${
                active === id
                  ? "bg-[#9D7B19] text-white font-semibold"
                  : "bg-[#222222] text-gray-300 hover:text-white hover:bg-[#3B5952] hover:font-bold"
              }`}
                >
                  <span>{label}</span>
                  <IoMdArrowDropright
                    size={12}
                    className={active === id ? "text-white" : "text-gray-400"}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
