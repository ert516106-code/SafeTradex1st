import React from "react";

function Input({
  className = "",
  ...props
}) {
  return (
    <input
      {...props}
      className={`w-full h-10 border rounded-md px-3 outline-none ${className}`}
    />
  );
}

export { Input };
export default Input;
