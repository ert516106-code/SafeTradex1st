import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium ${
        variant === "outline"
          ? "border border-gray-300"
          : "bg-blue-600 text-white"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
