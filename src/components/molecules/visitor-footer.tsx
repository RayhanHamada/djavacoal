"use client";

import React from "react";

export default function VisitorFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-4 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
      &copy; {year} Djavacoal. All rights reserved.
    </footer>
  );
}
