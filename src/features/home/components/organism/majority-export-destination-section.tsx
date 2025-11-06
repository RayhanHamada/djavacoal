"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";

import { SectionHeading } from "@/features/home/components/atoms";

const highlightedCountries = [
    "Saudi Arabia",
    "Lebanon",
    "Iran",
    "Iraq",
    "Bahrain",
    "Jordan",
    "Kuwait",
    "Oman",
    "Yemen",
    "Turkey",
    "Japan",
    "South Korea",
    "Australia",
    "Germany",
    "Belgium",
    "Spain",
    "United States of America",
    "Brazil",
    "Russia",
    "Guinea",
    "Sierra Leone",
    "India",
    "Pakistan",
];

const semarang = [110.4167, -6.9667];

interface GeoProps {
    rsmKey: string;
    properties: { name: string };
}

export default function MajorityExportDestinationSection() {
    const t = useTranslations("Home.exportDestination");
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [zoom, setZoom] = useState(false);

    return (
        <section className="relative w-full overflow-hidden bg-[#1C1C1C] py-12 md:px-10 lg:px-20">
            {/* 🔹 Garis atas */}
            <div className="absolute top-0 left-0 h-[1px] w-full bg-[#9C9C9C]" />

            {/* ✅ TITLE */}
            <SectionHeading
                title={t("title")}
                highlight={t("highlight")}
                variant="center"
            />

            {/* ✅ MAP */}
            <div className="relative mx-auto mt-6 max-w-7xl pb-10">
                <div
                    className={`transition-transform duration-500 ease-in-out ${
                        zoom ? "scale-[1.15]" : "scale-100"
                    }`}
                    onClick={() => setZoom(!zoom)}
                    style={{ cursor: "zoom-in" }}
                >
                    <ComposableMap
                        projectionConfig={{ scale: 155, center: [10, 10] }}
                        width={980}
                        height={450}
                        style={{ width: "100%", height: "auto" }}
                    >
                        <Geographies geography="/world-110m.json">
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo: GeoProps) => {
                                    const name = geo.properties.name;
                                    const isActive =
                                        highlightedCountries.includes(name);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                                isActive
                                                    ? "#EFA12D"
                                                    : "#d1d1d1ff"
                                            }
                                            stroke="#0D0D0D"
                                            strokeWidth={0.4}
                                            onMouseEnter={(e: any) => {
                                                const { clientX, clientY } = e;
                                                setHoveredCountry(name);
                                                setTooltipPos({
                                                    x: clientX,
                                                    y: clientY,
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredCountry(null);
                                                setTooltipPos(null);
                                            }}
                                            style={{
                                                default: { outline: "none" },
                                                hover: {
                                                    fill: isActive
                                                        ? "#fdc058ff"
                                                        : "#BBBBBB",
                                                    cursor: isActive
                                                        ? "zoom-in"
                                                        : "default",
                                                },
                                                pressed: { outline: "none" },
                                                focus: { outline: "none" },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>

                        {/* ✅ SEMARANG Marker */}
                        <Marker coordinates={semarang}>
                            <circle
                                r={6}
                                fill="#FF0000"
                                stroke="#ffffff"
                                strokeWidth={2}
                                onMouseEnter={(e: any) => {
                                    const { clientX, clientY } = e;
                                    setHoveredCountry(t("fromSemarang"));
                                    setTooltipPos({ x: clientX, y: clientY });
                                }}
                                onMouseLeave={() => {
                                    setHoveredCountry(null);
                                    setTooltipPos(null);
                                }}
                                style={{ cursor: "pointer" }}
                            />
                        </Marker>
                    </ComposableMap>
                </div>

                {/* ✅ TOOLTIP COUNTRY */}
                {hoveredCountry && tooltipPos && (
                    <div
                        className="pointer-events-none fixed z-50 rounded-md bg-black/85 px-2 py-1 text-xs font-semibold text-white shadow-lg"
                        style={{
                            top: tooltipPos.y + 10,
                            left: tooltipPos.x + 10,
                            transform: "translate(-50%, -120%)",
                        }}
                    >
                        {hoveredCountry}
                    </div>
                )}
            </div>

            {/* 🔹 Garis bawah */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#9C9C9C]" />
        </section>
    );
}
