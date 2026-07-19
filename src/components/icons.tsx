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

type NetPoint = { x: number; y: number };

// A compact view of the actual multimodal prediction pipeline: three feature
// families are encoded independently, fused, and resolved into one outcome.
const inputs = [
  { label: "CLINICAL", detail: "language features", y: 160 },
  { label: "RADIOMICS", detail: "quantitative imaging", y: 280 },
  { label: "DEEP LEARNING", detail: "learned image features", y: 400 },
];

const encoderNodes: NetPoint[] = [130, 205, 280, 355, 430].map((y) => ({ x: 300, y }));
const fusionNodes: NetPoint[] = [175, 245, 315, 385].map((y) => ({ x: 420, y }));
const outputNode: NetPoint = { x: 535, y: 280 };

type NetEdge = { from: NetPoint; to: NetPoint };

const netEdges: NetEdge[] = [
  ...inputs.flatMap((input) =>
    encoderNodes.map((to) => ({ from: { x: 215, y: input.y }, to }))
  ),
  ...encoderNodes.flatMap((from) => fusionNodes.map((to) => ({ from, to }))),
  ...fusionNodes.map((from) => ({ from, to: outputNode })),
];

export function HeroNetwork({ theme }: { theme: Theme }) {
  const primary = theme === "dark" ? "#2dd4bf" : "#0f766e";
  const secondary = theme === "dark" ? "#8b96a8" : "#94a3b8";

  return (
    <svg
      className="d22-hero-net"
      viewBox="0 0 620 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="d22-net-line" x1="190" y1="280" x2="555" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor={secondary} stopOpacity="0.15" />
          <stop offset="0.58" stopColor={primary} stopOpacity="0.58" />
          <stop offset="1" stopColor={primary} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="d22-net-orb">
          <stop stopColor={primary} stopOpacity="0.2" />
          <stop offset="1" stopColor={primary} stopOpacity="0" />
        </radialGradient>
        <filter id="d22-net-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="425" cy="280" r="180" fill="url(#d22-net-orb)" className="d22-net-detail" />

      {netEdges.map(({ from, to }, i) => {
        return (
          <path
            key={`e-${i}`}
            d={`M${from.x} ${from.y} C${from.x + 40} ${from.y}, ${to.x - 40} ${to.y}, ${to.x} ${to.y}`}
            stroke="url(#d22-net-line)"
            className="d22-net-edge"
          />
        );
      })}

      {inputs.map((input) => (
        <circle
          key={`in-${input.label}`}
          cx="215"
          cy={input.y}
          r="4.5"
          fill={secondary}
          className="d22-net-node"
        />
      ))}

      {inputs.map((input) => (
        <g key={input.label} className="d22-net-input">
          <rect className="d22-net-input-panel" x="52" y={input.y - 28} width="163" height="56" rx="12" />
          <text x="70" y={input.y + 4} className="d22-net-input-letter">{input.label[0]}</text>
          <text x="80" y={input.y + 4} className="d22-net-input-suffix">{input.label.slice(1)}</text>
          <text x="70" y={input.y + 18} className="d22-net-input-detail">{input.detail}</text>
        </g>
      ))}

      {[...encoderNodes, ...fusionNodes].map((node, i) => (
        <g key={`n-${i}`} className="d22-net-node" style={{ animationDelay: `${i * -0.38}s` }}>
          <circle cx={node.x} cy={node.y} r="13" className="d22-net-node-halo" />
          <circle cx={node.x} cy={node.y} r="4.5" fill={i < encoderNodes.length ? secondary : primary} />
        </g>
      ))}

      <g className="d22-net-output">
        <circle cx={outputNode.x} cy={outputNode.y} r="42" />
        <circle cx={outputNode.x} cy={outputNode.y} r="28" />
        <circle cx={outputNode.x} cy={outputNode.y} r="6" fill={primary} filter="url(#d22-net-glow)" />
        <text x={outputNode.x} y={outputNode.y + 62} textAnchor="middle">OUTCOME</text>
      </g>

      <g className="d22-net-column-labels">
        <text x="300" y="493" textAnchor="middle">ENCODERS</text>
        <text x="420" y="443" textAnchor="middle">FUSION</text>
      </g>

      <text x="598" y="548" textAnchor="end" className="d22-net-corner">
        RSNA 2025 · SPIE 2026
      </text>

      {[160, 280, 400].map((y, i) => (
        <circle key={`s-${y}`} r="3.2" fill={primary} className="d22-net-particle" filter="url(#d22-net-glow)">
          <animateMotion
            dur={`${4.8 + i * 0.65}s`}
            begin={`${i * -1.7}s`}
            repeatCount="indefinite"
            path={`M215 ${y} C260 ${y}, 365 ${280 + (i - 1) * 35}, 493 280`}
          />
        </circle>
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
