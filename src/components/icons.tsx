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

export function LogoMark({ theme }: { theme: Theme }) {
  const primary = theme === "dark" ? "#2dd4bf" : "#0f766e";
  const secondary = theme === "dark" ? "#8b96a8" : "#64748b";

  return (
    <svg
      className="d22-nav-logo-mark"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 10V7a3 3 0 0 1 3-3h3" stroke={secondary} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 4h3a3 3 0 0 1 3 3v3" stroke={secondary} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 18v3a3 3 0 0 1-3 3h-3" stroke={secondary} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 24H7a3 3 0 0 1-3-3v-3" stroke={secondary} strokeWidth="1.6" strokeLinecap="round" />
      <circle className="d22-logo-dot" cx="14" cy="14" r="2.6" fill={primary} />
      <circle className="d22-logo-ring" cx="14" cy="14" r="6" stroke={primary} strokeWidth="1" fill="none" />
    </svg>
  );
}

const netLayers = [3, 5, 5, 3];
const netLayerY = [90, 270, 450, 630];
const netSpacing = 85;

type NetNode = { x: number; y: number; layer: number; index: number };

const netNodes: NetNode[] = netLayers.flatMap((count, layer) =>
  Array.from({ length: count }, (_, index) => ({
    x: 250 + (index - (count - 1) / 2) * netSpacing,
    y: netLayerY[layer],
    layer,
    index,
  }))
);

const netEdges = netNodes.flatMap((from) =>
  netNodes
    .filter((to) => to.layer === from.layer + 1)
    .map((to) => ({ from, to }))
);

const netInputLabels = ["ct", "notes", "labs"];
const netOutputLabels = ["dx", "survival", "risk"];

export function HeroNetwork({ theme }: { theme: Theme }) {
  const primary = theme === "dark" ? "#2dd4bf" : "#0f766e";
  const secondary = theme === "dark" ? "#8b96a8" : "#94a3b8";

  return (
    <svg
      className="d22-hero-net"
      viewBox="0 0 500 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {netEdges.map(({ from, to }, i) => {
        const signal = i % 7 === 0;
        return (
          <line
            key={`e-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={signal ? primary : secondary}
            strokeWidth={signal ? 1.4 : 0.7}
            opacity={signal ? 0.85 : 0.3}
            className={signal ? "d22-net-signal" : undefined}
            style={signal ? { animationDelay: `${(i % 5) * 1.3}s` } : undefined}
          />
        );
      })}
      {netNodes.map((node, i) => (
        <circle
          key={`n-${i}`}
          cx={node.x}
          cy={node.y}
          r="5"
          fill={node.layer % 2 === 0 ? primary : secondary}
          className="d22-net-node"
          style={{ animationDelay: `${(i % 6) * 0.7}s` }}
        />
      ))}
      {netNodes
        .filter((node) => node.layer === 0)
        .map((node) => (
          <text
            key={`in-${node.index}`}
            x={node.x}
            y={node.y - 24}
            textAnchor="middle"
            className="d22-net-label"
            fill={secondary}
          >
            {netInputLabels[node.index]}
          </text>
        ))}
      {netNodes
        .filter((node) => node.layer === netLayers.length - 1)
        .map((node) => (
          <text
            key={`out-${node.index}`}
            x={node.x}
            y={node.y + 36}
            textAnchor="middle"
            className="d22-net-label"
            fill={primary}
          >
            {netOutputLabels[node.index]}
          </text>
        ))}
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
