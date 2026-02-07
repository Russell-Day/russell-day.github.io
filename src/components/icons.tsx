import { type Theme } from "./types";

export function SunIcon() {
  return (
    <svg
      className="d22-sun-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg
      className="d22-moon-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .3.02.6.06.9a7 7 0 0 0 8.83 8.83c.3.04.6.06.9.06z" />
    </svg>
  );
}

export function HelixLogo({ theme }: { theme: Theme }) {
  const primary = theme === "dark" ? "#00d4ff" : "#2a7c8a";
  const secondary = theme === "dark" ? "#9b72cf" : "#7c5cbf";

  return (
    <svg
      className="d22-nav-logo-helix"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M14 2C18 6 18 11 14 14C10 17 10 22 14 26" stroke={primary} strokeWidth="1.6" />
      <path d="M14 2C10 6 10 11 14 14C18 17 18 22 14 26" stroke={secondary} strokeWidth="1.6" />
      {[5, 9, 13, 17, 21, 25].map((y, index) => (
        <line
          key={y}
          x1={index % 2 === 0 ? 11 : 17}
          y1={y}
          x2={index % 2 === 0 ? 17 : 11}
          y2={y}
          stroke={index % 2 === 0 ? primary : secondary}
          strokeWidth="0.9"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

export function HeroDNA({ theme }: { theme: Theme }) {
  const primary = theme === "dark" ? "#00d4ff" : "#2a7c8a";
  const secondary = theme === "dark" ? "#9b72cf" : "#7c5cbf";

  return (
    <svg
      className="d22-hero-dna"
      viewBox="0 0 500 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="d22-hero-strand">
        <path
          d="M250 0 C350 50 350 130 250 175 C150 220 150 300 250 350 C350 400 350 480 250 525 C150 570 150 650 250 700"
          stroke={primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M250 0 C150 50 150 130 250 175 C350 220 350 300 250 350 C150 400 150 480 250 525 C350 570 350 650 250 700"
          stroke={secondary}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {[45, 90, 135, 220, 265, 310, 395, 440, 485, 570, 615, 660].map((y, i) => {
          const progress = (y % 175) / 175;
          const amplitude = 80;
          const offset = Math.sin(progress * Math.PI) * amplitude;
          const x1 = 250 - offset;
          const x2 = 250 + offset;
          return (
            <line
              key={i}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={i % 2 === 0 ? primary : secondary}
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}
        {[45, 90, 135, 220, 265, 310, 395, 440, 485, 570, 615, 660].map((y, i) => {
          const progress = (y % 175) / 175;
          const amplitude = 80;
          const offset = Math.sin(progress * Math.PI) * amplitude;
          return (
            <g key={`dots-${i}`}>
              <circle
                cx={250 - offset}
                cy={y}
                r="3"
                fill={i % 2 === 0 ? primary : secondary}
                opacity="0.6"
              />
              <circle
                cx={250 + offset}
                cy={y}
                r="3"
                fill={i % 2 === 0 ? secondary : primary}
                opacity="0.6"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function EmailIcon() {
  return (
    <svg
      className="d22-contact-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg
      className="d22-contact-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg
      className="d22-contact-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
