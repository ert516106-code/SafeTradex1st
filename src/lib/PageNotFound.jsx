import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px"
      }}
    >
      <h1 style={{ fontSize: "60px", fontWeight: "bold" }}>
        404
      </h1>

      <p>Page not found</p>

      <Link
        to="/"
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          textDecoration: "none"
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
