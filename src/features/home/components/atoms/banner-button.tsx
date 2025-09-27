"use client";

import { cn } from "@/utils/cn";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const BannerButton = React.forwardRef<HTMLButtonElement, Props>(
  function Button(props, ref) {
    const { variant = "primary", ...rest } = props;

    const classnames = cn(
      "bg-transparent/25 p-8 rounded-lg",
      variant === "primary" ? "text-white border-primary" : "",
      variant === "secondary" ? "text-blue-600 border border-blue-600" : "avoca"
    );

    return (
      <button ref={ref} className={`banner-button ${classnames}`} {...rest}>
        {props.children}
      </button>
    );
  }
);
