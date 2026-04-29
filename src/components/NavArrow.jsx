import { motion } from "framer-motion";
import "./NavArrow.css";

export default function NavArrow({ dir, onClick }) {
  return (
    <motion.button
      className={`nav-arrow nav-arrow--${dir}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      <span className="nav-glow" />
      <span className="nav-ring" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "prev"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </motion.button>
  );
}
