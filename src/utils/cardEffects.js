/**
 * Applies a 3D perspective tilt to a card element based on mouse position.
 * Also sets --mx/--my CSS variables for spotlight sheen effects.
 */
export function applyCardTilt(e, el) {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(500px) rotateX(${(y - 0.5) * 12}deg) rotateY(${(x - 0.5) * -12}deg) scale(1.04)`;
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
}

/** Resets the card tilt back to neutral. */
export function resetCardTilt(el) {
  el.style.transform = "";
}

/**
 * Spawns floating particle elements inside a card on hover.
 * @param {HTMLElement} el            - the card element to append particles to
 * @param {string}      particleClass - CSS class name for the particle (e.g. "bl-particle")
 * @param {string}      animationName - keyframe animation name (e.g. "blFloatUp")
 */
export function spawnParticles(el, particleClass, animationName) {
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("div");
    p.className = particleClass;
    const sz = Math.random() * 3 + 2;
    const x  = Math.random() * 70 + 15;
    const d  = Math.random() * 0.2;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${x}%;bottom:6px;animation:${animationName} ${0.5 + Math.random() * 0.4}s ${d}s ease-out forwards`;
    el.appendChild(p);
    setTimeout(() => p.remove(), (1 + d) * 1000);
  }
}

/**
 * Spawns a ripple element inside a card on click.
 * @param {MouseEvent}  e           - the click event
 * @param {HTMLElement} el          - the card element
 * @param {string}      rippleClass - CSS class name for the ripple (e.g. "bl-ripple")
 */
export function spawnRipple(e, el, rippleClass) {
  const r   = el.getBoundingClientRect();
  const rip = document.createElement("div");
  const sz  = Math.max(el.offsetWidth, el.offsetHeight) * 2.5;
  rip.className = rippleClass;
  rip.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`;
  el.appendChild(rip);
  setTimeout(() => rip.remove(), 560);
}
