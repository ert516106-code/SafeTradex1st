import React from "react";

export default function PageContainer({
  children,
  className = "",
}) {
  return (
    <main
      className={`min-h-screen w-full bg-[#07111F] text-white ${className}`}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-screen-2xl
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          xl:px-12
          py-6
        "
      >
        {children}
      </div>
    </main>
  );
}
