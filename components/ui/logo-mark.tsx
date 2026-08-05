/* ─────────────────────────────
   LogoMark — NovaWeather emblem.
   Stylized "N" formed by a globe
   arc + orbital ring.
   ───────────────────────────── */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nw-g" x1="4" y1="4" x2="36" y2="36">
          <stop offset="0" stopColor="#67e8f9" />
          <stop offset="0.55" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* Orbital ring */}
      <ellipse
        cx="20"
        cy="20"
        rx="15.5"
        ry="6.5"
        transform="rotate(-24 20 20)"
        stroke="url(#nw-g)"
        strokeWidth="1.6"
        opacity="0.55"
      />
      {/* Globe arc (N shape) */}
      <path
        d="M12 27V13.5C12 12.7 12.7 12 13.5 12h4c0.8 0 1.5 0.7 1.5 1.5V27"
        stroke="url(#nw-g)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 27V13.5C19 12.7 19.7 12 20.5 12h4c0.8 0 1.5 0.7 1.5 1.5V27"
        stroke="url(#nw-g)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ground line */}
      <path
        d="M11 27.5h18"
        stroke="url(#nw-g)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Live dot */}
      <circle cx="32.5" cy="10.5" r="2.1" fill="#67e8f9">
        <animate
          attributeName="opacity"
          values="1;0.35;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
