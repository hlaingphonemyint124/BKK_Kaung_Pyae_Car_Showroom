import React from "react";
import SoldHistory from "../section/SoldHistory";

// Full page wrapper for /sold-history route
export default function SoldHistoryPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <SoldHistory />
    </div>
  );
}