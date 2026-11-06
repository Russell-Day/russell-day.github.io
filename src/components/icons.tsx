import { type Theme } from "./types";


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

export function HeroNetwork({ theme, colors }: { theme: Theme; colors?: { primary: string; secondary: string } }) {
  const primary = colors?.primary ?? (theme === "dark" ? "#2dd4bf" : "#0f766e");
  const secondary = colors?.secondary ?? (theme === "dark" ? "#8b96a8" : "#94a3b8");

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

