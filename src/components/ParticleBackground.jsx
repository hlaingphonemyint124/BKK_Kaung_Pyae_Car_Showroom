import { useRef, useEffect } from "react";
import "./ParticleBackground.css";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const COLS = [
      "rgba(220,30,30,", "rgba(200,20,20,",
      "rgba(240,60,60,", "rgba(180,10,10,",
      "rgba(255,80,50,",
    ];
    const pts = Array.from({ length: 220 }, () => ({
      x:   Math.random() * canvas.width,
      y:   canvas.height + Math.random() * canvas.height,
      r0:  Math.random() * 4.5 + 1.2,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      a:   Math.random() * 0.5 + 0.45,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  -Math.random() * 0.55 - 0.15,
      fl:  Math.random() * 0.015 + 0.004,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.a += Math.sin(Date.now() * p.fl) * 0.006;
        p.a = Math.max(0.3, Math.min(0.95, p.a));
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10)               p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const pct = Math.max(0, Math.min(1, p.y / canvas.height));
        const r = Math.max(0.3, p.r0 * pct);
        const a = p.a * (0.3 + pct * 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.col}${a.toFixed(2)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="sec-particles" aria-hidden="true" />;
}
