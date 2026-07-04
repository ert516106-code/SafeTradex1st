import React from "react";

export const Input = ({
  className = "",
  ...props
}) => {
  return (
    <input
      {...props}
      className={`w-full h-10 border rounded-md px-3 outline-none ${className}`}
    />
  );
};
