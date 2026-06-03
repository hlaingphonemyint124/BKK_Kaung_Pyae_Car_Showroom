import React from "react";
import "./Spinner.css";

const SIZES = { sm: 20, md: 32, lg: 48 };

function Spinner({ size = "md" }) {
  const px = SIZES[size] ?? SIZES.md;
  return (
    <div className="spinner-wrap">
      <div className="spinner" style={{ width: px, height: px }} />
    </div>
  );
}

export default Spinner;
