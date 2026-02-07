/**
 * Agent Dashboard
 * Top-down floor plan of a biotech research facility.
 * Rooms: Server Room, Research Lab, Admin Office, Comms Center, Lounge.
 * Agents walk to their room when running, idle in the lounge when not.
 */
import { useState } from "react";
import { siteConfig } from "../config";
import {
  agents,
  activityLog,
  formatTimeAgo,
  formatUptime,
  getAgentById,
  modeColors,
} from "./mockData";
import type { AgentData, AgentSentiment } from "./types";

/* ── Room assignments ── */
const agentRoom: Record<string, string> = {
  main: "server",
  canvas: "lab",
  calendar: "office",
  gmail: "comms",
};

const roomMeta: Record<string, { label: string; x: number; y: number; w: number; h: number }> = {
  server:  { label: "Server Room",   x: 2,  y: 2,  w: 33, h: 42 },
  lab:     { label: "Research Lab",   x: 64, y: 2,  w: 35, h: 42 },
  office:  { label: "Admin Office",   x: 2,  y: 56, w: 33, h: 42 },
  comms:   { label: "Comms Center",   x: 64, y: 56, w: 35, h: 42 },
  lounge:  { label: "Lounge",         x: 37, y: 30, w: 26, h: 40 },
};

/* Position inside the room where agent stands when working */
const workSpot: Record<string, { x: number; y: number }> = {
  server: { x: 18, y: 18 },
  lab:    { x: 81, y: 18 },
  office: { x: 18, y: 72 },
  comms:  { x: 81, y: 72 },
};

/* Lounge spots for idle agents */
const loungeSpots: Record<string, { x: number; y: number }> = {
  main:     { x: 44, y: 46 },
  canvas:   { x: 56, y: 44 },
  calendar: { x: 44, y: 56 },
  gmail:    { x: 56, y: 56 },
};

const sentimentAnim: Record<AgentSentiment, string> = {
  focused:      "d22-lab-anim-work",
  busy:         "d22-lab-anim-hustle",
  curious:      "d22-lab-anim-look",
  satisfied:    "d22-lab-anim-relax",
  overwhelmed:  "d22-lab-anim-stress",
  bored:        "d22-lab-anim-idle",
  resting:      "d22-lab-anim-rest",
};

const coatColor: Record<string, string> = {
  main:     "#818cf8",
  canvas:   "#22d3ee",
  calendar: "#fbbf24",
  gmail:    "#f87171",
};

/* ── Sprite ── */
function LabSprite({ slug, isWorking, sentiment }: { slug: string; isWorking: boolean; sentiment: AgentSentiment }) {
  const accent = coatColor[slug] ?? "#818cf8";
  const animClass = sentimentAnim[sentiment];
  const idleInLounge = !isWorking;

  return (
    <div className={`d22-lab-sprite ${animClass} ${idleInLounge ? "d22-lab-sprite-lounge" : ""}`}>
      <svg viewBox="0 0 24 36" className="d22-lab-sprite-svg" aria-hidden="true">
        {/* Head */}
        <circle cx="12" cy="6" r="5" fill="#f5d0a9" />
        {/* Hair */}
        <ellipse cx="12" cy="4" rx="5" ry="3" fill="#4a3728" />
        {/* Eyes */}
        <rect x="9" y="5.5" width="1.5" height="1.5" rx="0.5" fill="#2d2d2d" />
        <rect x="13.5" y="5.5" width="1.5" height="1.5" rx="0.5" fill="#2d2d2d" />
        {/* Smile when idle */}
        {idleInLounge && (
          <path d="M10,8.5 Q12,10 14,8.5" fill="none" stroke="#2d2d2d" strokeWidth="0.6" />
        )}
        {/* Lab coat */}
        <rect x="5" y="11" width="14" height="14" rx="2" fill="white" opacity="0.95" />
        {/* Coat lapels/accent stripe */}
        <rect x="5" y="11" width="14" height="2.5" rx="1" fill={accent} opacity="0.85" />
        {/* Pocket */}
        <rect x="14" y="17" width="3" height="4" rx="0.5" fill={accent} opacity="0.2" />
        {/* Pen in pocket */}
        <rect x="15.5" y="16" width="0.8" height="3" rx="0.3" fill={accent} opacity="0.6" />
        {/* ID badge */}
        <rect x="7" y="15" width="4" height="5" rx="0.5" fill="#e8e8e8" stroke={accent} strokeWidth="0.4" />
        <rect x="7.8" y="16" width="2.4" height="1.5" rx="0.3" fill={accent} opacity="0.3" />
        <circle cx="9" cy="14.2" r="0.6" fill={accent} opacity="0.5" />
        {/* Arms */}
        <rect x="2" y="12" width="3" height="10" rx="1.5" fill="white" opacity="0.9"
          className={isWorking ? "d22-lab-arm-l" : ""} />
        <rect x="19" y="12" width="3" height="10" rx="1.5" fill="white" opacity="0.9"
          className={isWorking ? "d22-lab-arm-r" : ""} />
        {/* Hands */}
        <circle cx="3.5" cy="22" r="1.5" fill="#f5d0a9" className={isWorking ? "d22-lab-arm-l" : ""} />
        <circle cx="20.5" cy="22" r="1.5" fill="#f5d0a9" className={isWorking ? "d22-lab-arm-r" : ""} />
        {/* Legs */}
        <rect x="7" y="25" width="4" height="7" rx="1.5" fill="#3b4252" />
        <rect x="13" y="25" width="4" height="7" rx="1.5" fill="#3b4252" />
        {/* Shoes */}
        <rect x="6" y="31" width="5.5" height="3" rx="1" fill="#2e3440" />
        <rect x="12.5" y="31" width="5.5" height="3" rx="1" fill="#2e3440" />
        {/* Safety glasses when working */}
        {isWorking && (
          <g>
            <rect x="8" y="4.5" width="3.5" height="2.5" rx="1" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.7" />
            <rect x="12.5" y="4.5" width="3.5" height="2.5" rx="1" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.7" />
            <line x1="11.5" y1="5.5" x2="12.5" y2="5.5" stroke={accent} strokeWidth="0.4" opacity="0.5" />
          </g>
        )}
        {/* Coffee mug when in lounge */}
        {idleInLounge && (
          <g transform="translate(19, 18)">
            <rect x="0" y="0" width="4" height="5" rx="0.8" fill="white" stroke="#bbb" strokeWidth="0.3" />
            <path d="M4,1 Q6,1 6,3 Q6,5 4,5" fill="none" stroke="#bbb" strokeWidth="0.5" />
            <rect x="0.5" y="0.5" width="3" height="1.5" rx="0.3" fill="#6f4e37" opacity="0.6" />
            {/* Steam */}
            <path d="M1.5,-1 Q2,-3 1,-4" fill="none" stroke="#999" strokeWidth="0.3" opacity="0.4" className="d22-lab-steam" />
            <path d="M3,-1 Q3.5,-3.5 2.5,-5" fill="none" stroke="#999" strokeWidth="0.3" opacity="0.3" className="d22-lab-steam" style={{ animationDelay: "0.5s" }} />
          </g>
        )}
      </svg>
    </div>
  );
}

/* ── Room furniture (SVG inline) ── */
function ServerRoomFurniture() {
  return (
    <g>
      {/* Server racks */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${8 + i * 22}, 8)`}>
          <rect x="0" y="0" width="16" height="55" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
            <g key={j}>
              <rect x="2" y={3 + j * 6.5} width="12" height="4.5" rx="0.5" fill="var(--accent-primary)" opacity="0.22" />
              <circle cx={12} cy={5 + j * 6.5} r="1.2" className="d22-lab-server-led"
                style={{ animationDelay: `${(i * 8 + j) * 0.15}s` }} />
            </g>
          ))}
        </g>
      ))}
      {/* Cable tray */}
      <line x1="4" y1="68" x2="70" y2="68" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.35" />
    </g>
  );
}

function ResearchLabFurniture() {
  return (
    <g>
      {/* Lab bench */}
      <rect x="6" y="10" width="60" height="18" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      {/* Microscope */}
      <g transform="translate(12, 4)">
        <rect x="0" y="6" width="8" height="2" rx="0.5" fill="var(--text-muted)" opacity="0.7" />
        <rect x="2.5" y="0" width="3" height="8" rx="0.5" fill="var(--text-muted)" opacity="0.65" />
        <rect x="1" y="0" width="6" height="2" rx="0.5" fill="var(--accent-primary)" opacity="0.5" />
        <circle cx="4" cy="1" r="1.5" fill="var(--accent-primary)" opacity="0.4" />
      </g>
      {/* Beakers */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${30 + i * 12}, 4)`}>
          <path d={`M1,8 L0,0 L6,0 L5,8 Z`} fill="none" stroke="var(--accent-primary)" strokeWidth="0.7" opacity="0.55" />
          <rect x="0.5" y={4 - i} width="5" height={4 + i} rx="0.3" fill="var(--accent-primary)" opacity={0.18 + i * 0.06} />
          <circle cx="3" cy={6 - i * 0.5} r="0.8" fill="var(--accent-primary)" opacity="0.35" className="d22-lab-bubble"
            style={{ animationDelay: `${i * 0.7}s` }} />
        </g>
      ))}
      {/* Fume hood */}
      <rect x="6" y="38" width="30" height="25" rx="2" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      <rect x="8" y="40" width="26" height="14" rx="1" fill="var(--accent-primary)" opacity="0.1" />
      <text x="21" y="62" textAnchor="middle" fill="var(--text-muted)" fontSize="3" fontFamily="var(--mono)" opacity="0.4">FUME HOOD</text>
      {/* Whiteboard */}
      <rect x="42" y="38" width="24" height="18" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <line x1="44" y1="43" x2="58" y2="43" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.35" />
      <line x1="44" y1="47" x2="54" y2="47" stroke="var(--accent-secondary)" strokeWidth="0.6" opacity="0.3" />
      <line x1="44" y1="51" x2="62" y2="51" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.25" />
    </g>
  );
}

function AdminOfficeFurniture() {
  return (
    <g>
      {/* Desk */}
      <rect x="10" y="16" width="36" height="20" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      {/* Monitor */}
      <rect x="18" y="10" width="18" height="12" rx="1" fill="var(--accent-primary-dim)" stroke="var(--border)" strokeWidth="0.8" />
      <rect x="24" y="22" width="6" height="3" rx="0.3" fill="var(--text-muted)" opacity="0.55" />
      <rect x="20" y="12" width="14" height="8" rx="0.5" fill="var(--accent-primary)" opacity="0.15" />
      {/* Keyboard */}
      <rect x="20" y="27" width="14" height="4" rx="0.5" fill="var(--text-muted)" opacity="0.45" />
      {/* Chair */}
      <circle cx="28" cy="44" r="7" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <circle cx="28" cy="44" r="4" fill="var(--accent-secondary)" opacity="0.2" />
      {/* Filing cabinet */}
      <rect x="54" y="10" width="12" height="40" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="56" y={13 + i * 12} width="8" height="9" rx="0.5" fill="var(--accent-secondary)" opacity="0.2" />
          <rect x="59" y={16 + i * 12} width="2" height="1" rx="0.3" fill="var(--text-muted)" opacity="0.55" />
        </g>
      ))}
      {/* Plant */}
      <circle cx="8" cy="56" r="4" fill="#22c55e" opacity="0.45" />
      <rect x="6.5" y="56" width="3" height="6" rx="0.5" fill="#8B4513" opacity="0.55" />
    </g>
  );
}

function CommsCenterFurniture() {
  return (
    <g>
      {/* Monitors array */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={6 + i * 22} y="8" width="18" height="12" rx="1"
          fill="var(--accent-primary-dim)" stroke="var(--border)" strokeWidth="0.8" />
      ))}
      {/* Screen glow content */}
      {[0, 1, 2].map((i) => (
        <g key={`content-${i}`}>
          <rect x={8 + i * 22} y="10" width="14" height="2" rx="0.3" fill="var(--accent-primary)" opacity="0.2" />
          <rect x={8 + i * 22} y="13" width="10" height="1.5" rx="0.3" fill="var(--accent-primary)" opacity="0.15" />
          <rect x={8 + i * 22} y="16" width="12" height="1.5" rx="0.3" fill="var(--accent-secondary)" opacity="0.15" />
        </g>
      ))}
      {/* Desk */}
      <rect x="4" y="22" width="64" height="14" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      {/* Headset */}
      <g transform="translate(54, 24)">
        <path d="M0,6 Q0,0 5,0 Q10,0 10,6" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" opacity="0.6" />
        <circle cx="0" cy="6" r="2" fill="var(--text-muted)" opacity="0.45" />
        <circle cx="10" cy="6" r="2" fill="var(--text-muted)" opacity="0.45" />
      </g>
      {/* Signal wave display */}
      <rect x="10" y="42" width="52" height="22" rx="2" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <path d="M14,53 Q18,46 22,53 Q26,60 30,53 Q34,46 38,53 Q42,60 46,53 Q50,46 54,53 Q58,60 58,53"
        fill="none" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.45" className="d22-lab-wave" />
      {/* Antenna */}
      <g transform="translate(62, 44)">
        <line x1="3" y1="20" x2="3" y2="4" stroke="var(--text-muted)" strokeWidth="1" opacity="0.55" />
        <circle cx="3" cy="3" r="2" fill="none" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.4" className="d22-lab-antenna-pulse" />
        <circle cx="3" cy="3" r="4" fill="none" stroke="var(--accent-primary)" strokeWidth="0.4" opacity="0.2" className="d22-lab-antenna-pulse" style={{ animationDelay: "0.5s" }} />
      </g>
    </g>
  );
}

function LoungeFurniture() {
  return (
    <g>
      {/* Couch */}
      <rect x="6" y="8" width="42" height="16" rx="3" fill="var(--accent-secondary)" opacity="0.28" stroke="var(--border)" strokeWidth="0.6" />
      <rect x="8" y="10" width="12" height="12" rx="2" fill="var(--accent-secondary)" opacity="0.15" />
      <rect x="34" y="10" width="12" height="12" rx="2" fill="var(--accent-secondary)" opacity="0.15" />
      {/* Coffee table */}
      <rect x="14" y="30" width="26" height="12" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      {/* Magazines on table */}
      <rect x="16" y="32" width="6" height="4" rx="0.3" fill="var(--accent-primary)" opacity="0.22" transform="rotate(-5 19 34)" />
      <rect x="24" y="33" width="5" height="3.5" rx="0.3" fill="var(--accent-secondary)" opacity="0.22" transform="rotate(8 26 35)" />
      {/* Plant */}
      <g transform="translate(44, 34)">
        <rect x="0" y="5" width="7" height="9" rx="1" fill="#8B4513" opacity="0.5" />
        <ellipse cx="3.5" cy="3" rx="6" ry="5" fill="#22c55e" opacity="0.4" />
        <ellipse cx="5" cy="5" rx="4" ry="3" fill="#16a34a" opacity="0.3" />
      </g>
      {/* Water cooler */}
      <g transform="translate(2, 50)">
        <rect x="0" y="0" width="6" height="14" rx="0.5" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="1" y="1" width="4" height="6" rx="0.5" fill="var(--accent-primary)" opacity="0.2" />
        <circle cx="3" cy="3" r="0.8" fill="var(--accent-primary)" opacity="0.35" className="d22-lab-bubble" />
      </g>
      {/* Vending machine */}
      <rect x="44" y="50" width="10" height="18" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.5" />
      <rect x="45" y="52" width="8" height="5" rx="0.3" fill="var(--accent-primary)" opacity="0.15" />
      <rect x="45" y="58" width="8" height="5" rx="0.3" fill="var(--accent-secondary)" opacity="0.15" />
    </g>
  );
}

const roomFurniture: Record<string, React.FC> = {
  server: ServerRoomFurniture,
  lab: ResearchLabFurniture,
  office: AdminOfficeFurniture,
  comms: CommsCenterFurniture,
  lounge: LoungeFurniture,
};

/* ── Room component ── */
function Room({ id, meta }: { id: string; meta: typeof roomMeta[string] }) {
  const Furniture = roomFurniture[id];
  return (
    <div
      className="d22-lab-room"
      style={{
        left: `${meta.x}%`,
        top: `${meta.y}%`,
        width: `${meta.w}%`,
        height: `${meta.h}%`,
      }}
    >
      <svg className="d22-lab-room-svg" viewBox="0 0 72 72" preserveAspectRatio="xMidYMid meet">
        {/* Floor */}
        <rect x="0" y="0" width="72" height="72" rx="3" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="0.8" />

        {Furniture && <Furniture />}
      </svg>
      <div className={`d22-lab-room-label ${id === "lounge" ? "d22-lab-room-label-lounge" : ""}`}>
        {meta.label}
      </div>
    </div>
  );
}

/* ── Corridors ── */
function Corridors() {
  return (
    <svg className="d22-lab-corridors" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Horizontal corridors */}
      <rect x="35" y="15" width="30" height="4" fill="var(--bg-card)" opacity="0.4" />
      <rect x="35" y="68" width="30" height="4" fill="var(--bg-card)" opacity="0.4" />
      {/* Vertical corridors */}
      <rect x="35" y="15" width="4" height="57" fill="var(--bg-card)" opacity="0.4" />
      <rect x="61" y="15" width="4" height="57" fill="var(--bg-card)" opacity="0.4" />

    </svg>
  );
}

/* ── Floor plan header ── */
function FloorPlanHeader() {
  const running = agents.filter((a) => a.status.agent_mode === "running").length;
  return (
    <div className="d22-lab-header">
      <span> </span>
      <div className="d22-lab-header-left">
        <span className="d22-lab-header-tag">Floor 1</span>
        <span className="d22-lab-header-name">Research Wing</span>
      </div>
      <div className="d22-lab-header-right">
        <span className="d22-lab-header-stat">
          <span className="d22-lab-header-stat-dot" style={{ background: "#22c55e" }} />
          {running} active
        </span>
        <span className="d22-lab-header-stat">
          <span className="d22-lab-header-stat-dot" style={{ background: "#eab308" }} />
          {agents.length - running} idle
        </span>
        <text> </text>
      </div>
    </div>
  );
}

/* ── Agent on floor plan ── */
const hoverCards = siteConfig.agentDashboard.hoverCards;

function AgentOnFloor({ agent }: { agent: AgentData }) {
  const isWorking = agent.status.agent_mode === "running";
  const room = agentRoom[agent.profile.slug] ?? "server";
  const roomLabel = isWorking ? roomMeta[room]?.label ?? "Server Room" : "Lounge";
  const pos = isWorking
    ? workSpot[room]
    : loungeSpots[agent.profile.slug] ?? { x: 50, y: 50 };
  const color = modeColors[agent.status.agent_mode];
  const configuredCard = hoverCards[agent.profile.slug];
  const popupDirection = pos.y > 54 ? "d22-lab-hover-card-up" : "d22-lab-hover-card-down";

  return (
    <div
      className="d22-lab-agent"
      tabIndex={0}
      aria-label={`${agent.profile.display_name} status`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transition: "left 1.2s cubic-bezier(0.25, 1, 0.5, 1), top 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <div className={`d22-lab-hover-card ${popupDirection}`} style={{ ["--card-accent" as string]: color }}>
        <div className="d22-lab-card d22-lab-card-popover">
          <div className="d22-lab-card-top">
            <span className="d22-lab-card-dot" style={{ background: color }} />
            <span className="d22-lab-card-name">
              {configuredCard?.displayName ?? agent.profile.display_name}
            </span>
            <span className="d22-lab-card-mode" style={{ color }}>
              {agent.status.agent_mode}
            </span>
          </div>
          <div className="d22-lab-card-persona">
            {configuredCard?.persona ?? agent.profile.persona_description}
          </div>
          <div className="d22-lab-card-location">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1C5 1 3 3.5 3 6c0 4 5 9 5 9s5-5 5-9c0-2.5-2-5-5-5z" />
              <circle cx="8" cy="6" r="1.5" />
            </svg>
            {configuredCard?.location ?? roomLabel}
          </div>
          <div className="d22-lab-card-activity">
            {configuredCard?.activity ?? agent.status.activity_label}
          </div>
          <div className="d22-lab-card-meta">
            <span>{agent.status.sentiment}</span>
            <span>
              {agent.status.running_since
                ? `${formatUptime(agent.status.running_since)} uptime`
                : `${formatTimeAgo(agent.status.last_heartbeat)}`}
            </span>
            <span>{agent.profile.runs} runs</span>
          </div>
        </div>
      </div>
      <div className="d22-lab-agent-pip" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
      <LabSprite slug={agent.profile.slug} isWorking={isWorking} sentiment={agent.status.sentiment} />
      <div className="d22-lab-agent-tag">
        {agent.profile.slug}
      </div>
    </div>
  );
}

/* ── Status sidebar cards ── */
function AgentStatusCards({
  selected,
  onSelect,
  className = "",
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}) {
  return (
    <div className={`d22-lab-cards ${className}`.trim()}>
      {agents.map((agent) => {
        const color = modeColors[agent.status.agent_mode];
        const isWorking = agent.status.agent_mode === "running";
        const room = agentRoom[agent.profile.slug];
        const roomLabel = isWorking ? roomMeta[room]?.label : "Lounge";
        const isSelected = selected === agent.profile.agent_id;

        return (
          <div
            className={`d22-lab-card ${isSelected ? "d22-lab-card-active" : ""}`}
            key={agent.profile.agent_id}
            onClick={() => onSelect(isSelected ? null : agent.profile.agent_id)}
            style={{ ["--card-accent" as string]: color }}
          >
            <div className="d22-lab-card-top">
              <span className="d22-lab-card-dot" style={{ background: color }} />
              <span className="d22-lab-card-name">{agent.profile.display_name}</span>
              <span className="d22-lab-card-mode" style={{ color }}>
                {agent.status.agent_mode}
              </span>
            </div>
            <div className="d22-lab-card-persona">{agent.profile.persona_description}</div>
            <div className="d22-lab-card-location">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 1C5 1 3 3.5 3 6c0 4 5 9 5 9s5-5 5-9c0-2.5-2-5-5-5z" />
                <circle cx="8" cy="6" r="1.5" />
              </svg>
              {roomLabel}
            </div>
            <div className="d22-lab-card-activity">{agent.status.activity_label}</div>
            <div className="d22-lab-card-meta">
              <span>
                {agent.status.sentiment}
              </span>
              <span>
                {agent.status.running_since
                  ? `${formatUptime(agent.status.running_since)} uptime`
                  : `${formatTimeAgo(agent.status.last_heartbeat)}`}
              </span>
              <span>{agent.profile.runs} runs</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Activity log ── */
function LabActivityLog() {
  return (
    <div className="d22-lab-log">
      <div className="d22-lab-log-head">
        <div className="d22-lab-log-header">
          <span className="d22-lab-log-pip" />
          Lab Activity Feed
        </div>
        <p className="d22-lab-log-subhead">Recent orchestration events</p>
      </div>
      <div className="d22-lab-log-table">
        <div className="d22-lab-log-row d22-lab-log-row-header">
          <span className="d22-lab-log-col-time">When</span>
          <span className="d22-lab-log-col-agent">Agent</span>
          <span className="d22-lab-log-col-activity">Activity</span>
        </div>
        {activityLog.map((entry, i) => {
          const agent = getAgentById(entry.agent_id);
          const color = modeColors[agent?.status.agent_mode ?? "offline"];
          const agentLabel = agent?.profile.display_name ?? entry.agent_id;
          return (
            <div className="d22-lab-log-row" key={entry.log_id} style={{ animationDelay: `${i * 0.04}s` }}>
              <span className="d22-lab-log-col-time d22-lab-log-time">{formatTimeAgo(entry.logged_at)}</span>
              <span className="d22-lab-log-col-agent">
                <span
                  className="d22-lab-log-agent"
                  style={{
                    color,
                    borderColor: `${color}4d`,
                    background: `${color}14`,
                  }}
                >
                  {agentLabel}
                </span>
              </span>
              <span className="d22-lab-log-col-activity">{entry.summary}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function AgentDashboard() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="d22-lab-wrap">
      <FloorPlanHeader />
      <div className="d22-lab-layout">
        <div className="d22-lab-floor">
          <Corridors />
          {Object.entries(roomMeta).map(([id, meta]) => (
            <Room key={id} id={id} meta={meta} />
          ))}
          {agents.map((agent) => (
            <AgentOnFloor key={agent.profile.agent_id} agent={agent} />
          ))}
        </div>
        <AgentStatusCards
          selected={selected}
          onSelect={setSelected}
          className="d22-lab-cards-mobile"
        />
      </div>
      <LabActivityLog />
    </div>
  );
}
