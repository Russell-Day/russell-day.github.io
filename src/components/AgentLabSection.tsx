import { useState } from "react";
import SectionHeader from "./SectionHeader";
import {
  type Agent,
  type AgentLogEntry,
  type AgentMode,
  type AgentSentiment,
  type RevealState,
} from "./types";

const now = new Date();
const minutesAgo = (mins: number) =>
  new Date(now.getTime() - mins * 60_000).toISOString();

const agents: Agent[] = [
  {
    profile: {
      agent_id: "a1",
      slug: "main",
      display_name: "Main Agent",
      persona_description: "Orchestrator",
      runs: 847,
    },
    status: {
      agent_mode: "running",
      sentiment: "focused",
      activity_label: "Coordinating nightly batch",
      running_since: minutesAgo(134),
      last_heartbeat: minutesAgo(2),
    },
  },
  {
    profile: {
      agent_id: "a2",
      slug: "canvas",
      display_name: "Canvas Agent",
      persona_description: "Studious",
      runs: 312,
    },
    status: {
      agent_mode: "running",
      sentiment: "curious",
      activity_label: "Reviewing assignment deadlines",
      running_since: minutesAgo(92),
      last_heartbeat: minutesAgo(1),
    },
  },
  {
    profile: {
      agent_id: "a3",
      slug: "calendar",
      display_name: "Calendar Agent",
      persona_description: "Organized",
      runs: 1204,
    },
    status: {
      agent_mode: "idle",
      sentiment: "satisfied",
      activity_label: "Last sync: 12 events processed",
      running_since: null,
      last_heartbeat: minutesAgo(8),
    },
  },
  {
    profile: {
      agent_id: "a4",
      slug: "gmail",
      display_name: "Gmail Agent",
      persona_description: "Restless",
      runs: 2031,
    },
    status: {
      agent_mode: "running",
      sentiment: "busy",
      activity_label: "Triaging inbox — 47 unread",
      running_since: minutesAgo(45),
      last_heartbeat: minutesAgo(1),
    },
  },
];

const activityLog: AgentLogEntry[] = [
  { log_id: 1, agent_id: "a4", summary: "Sorted 23 promotional emails to archive", logged_at: minutesAgo(3) },
  { log_id: 2, agent_id: "a1", summary: "Dispatched Canvas check to review queue", logged_at: minutesAgo(7) },
  { log_id: 3, agent_id: "a2", summary: "Found 2 upcoming deadlines this week", logged_at: minutesAgo(12) },
  { log_id: 4, agent_id: "a3", summary: "Synced 12 calendar events successfully", logged_at: minutesAgo(18) },
  { log_id: 5, agent_id: "a4", summary: "Flagged 3 messages as high-priority", logged_at: minutesAgo(22) },
  { log_id: 6, agent_id: "a1", summary: "Health check passed — all agents nominal", logged_at: minutesAgo(30) },
  { log_id: 7, agent_id: "a2", summary: "Downloaded updated syllabus for EECS 281", logged_at: minutesAgo(45) },
  { log_id: 8, agent_id: "a3", summary: "Detected 1 scheduling conflict, resolved", logged_at: minutesAgo(52) },
  { log_id: 9, agent_id: "a4", summary: "Processed 58 messages in last batch", logged_at: minutesAgo(68) },
  { log_id: 10, agent_id: "a1", summary: "Initiated nightly coordination sequence", logged_at: minutesAgo(134) },
];

const modeColors: Record<AgentMode, string> = {
  running: "#22c55e",
  idle: "#eab308",
  paused: "#f97316",
  offline: "#6b7280",
};

type RoomId = "server" | "lab" | "office" | "comms" | "lounge";

const agentRooms: Record<string, RoomId> = {
  main: "server",
  canvas: "lab",
  calendar: "office",
  gmail: "comms",
};

const rooms: Record<RoomId, { label: string; x: number; y: number; w: number; h: number }> = {
  server: { label: "Server Room", x: 2, y: 2, w: 33, h: 42 },
  lab: { label: "Research Lab", x: 64, y: 2, w: 35, h: 42 },
  office: { label: "Admin Office", x: 2, y: 56, w: 33, h: 42 },
  comms: { label: "Comms Center", x: 64, y: 56, w: 35, h: 42 },
  lounge: { label: "Lounge", x: 37, y: 30, w: 26, h: 40 },
};

const workPositions: Record<RoomId, { x: number; y: number }> = {
  server: { x: 18, y: 18 },
  lab: { x: 81, y: 18 },
  office: { x: 18, y: 72 },
  comms: { x: 81, y: 72 },
  lounge: { x: 50, y: 50 },
};

const loungePositions: Record<string, { x: number; y: number }> = {
  main: { x: 44, y: 46 },
  canvas: { x: 56, y: 44 },
  calendar: { x: 44, y: 56 },
  gmail: { x: 56, y: 56 },
};

const sentimentAnims: Record<AgentSentiment, string> = {
  focused: "d22-lab-anim-work",
  busy: "d22-lab-anim-hustle",
  curious: "d22-lab-anim-look",
  satisfied: "d22-lab-anim-relax",
  overwhelmed: "d22-lab-anim-stress",
  bored: "d22-lab-anim-idle",
  resting: "d22-lab-anim-rest",
};

const agentColors: Record<string, string> = {
  main: "#818cf8",
  canvas: "#22d3ee",
  calendar: "#fbbf24",
  gmail: "#f87171",
};

const hoverCards: Record<string, { displayName: string; persona: string; location: string; activity: string }> = {
  main: {
    displayName: "Main Agent",
    persona: "Orchestrator",
    location: "Server Room",
    activity: "Coordinating nightly batch",
  },
  canvas: {
    displayName: "Canvas Agent",
    persona: "Studious",
    location: "Research Lab",
    activity: "Reviewing assignment deadlines",
  },
  calendar: {
    displayName: "Calendar Agent",
    persona: "Organized",
    location: "Lounge",
    activity: "Last sync: 12 events processed",
  },
  gmail: {
    displayName: "Gmail Agent",
    persona: "Restless",
    location: "Comms Center",
    activity: "Triaging inbox - 47 unread",
  },
};

function findAgent(agentId: string) {
  return agents.find((agent) => agent.profile.agent_id === agentId);
}

function timeAgo(timestamp: string) {
  const diffMins = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m ago`;
}

function uptime(timestamp: string | null) {
  if (!timestamp) return "—";
  const diffMins = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 60_000);
  if (diffMins < 60) return `${diffMins}m`;
  return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
}

function AgentSprite({
  slug,
  isWorking,
  sentiment,
}: {
  slug: string;
  isWorking: boolean;
  sentiment: AgentSentiment;
}) {
  const accent = agentColors[slug] ?? "#818cf8";
  const anim = sentimentAnims[sentiment];
  const relaxing = !isWorking;
  return (
    <div className={`d22-lab-sprite ${anim} ${relaxing ? "d22-lab-sprite-lounge" : ""}`}>
      <svg viewBox="0 0 24 36" className="d22-lab-sprite-svg" aria-hidden="true">
        <circle cx="12" cy="6" r="5" fill="#f5d0a9" />
        <ellipse cx="12" cy="4" rx="5" ry="3" fill="#4a3728" />
        <rect x="9" y="5.5" width="1.5" height="1.5" rx="0.5" fill="#2d2d2d" />
        <rect x="13.5" y="5.5" width="1.5" height="1.5" rx="0.5" fill="#2d2d2d" />
        {relaxing && (
          <path d="M10,8.5 Q12,10 14,8.5" fill="none" stroke="#2d2d2d" strokeWidth="0.6" />
        )}
        <rect x="5" y="11" width="14" height="14" rx="2" fill="white" opacity="0.95" />
        <rect x="5" y="11" width="14" height="2.5" rx="1" fill={accent} opacity="0.85" />
        <rect x="14" y="17" width="3" height="4" rx="0.5" fill={accent} opacity="0.2" />
        <rect x="15.5" y="16" width="0.8" height="3" rx="0.3" fill={accent} opacity="0.6" />
        <rect x="7" y="15" width="4" height="5" rx="0.5" fill="#e8e8e8" stroke={accent} strokeWidth="0.4" />
        <rect x="7.8" y="16" width="2.4" height="1.5" rx="0.3" fill={accent} opacity="0.3" />
        <circle cx="9" cy="14.2" r="0.6" fill={accent} opacity="0.5" />
        <rect x="2" y="12" width="3" height="10" rx="1.5" fill="white" opacity="0.9" className={isWorking ? "d22-lab-arm-l" : ""} />
        <rect x="19" y="12" width="3" height="10" rx="1.5" fill="white" opacity="0.9" className={isWorking ? "d22-lab-arm-r" : ""} />
        <circle cx="3.5" cy="22" r="1.5" fill="#f5d0a9" className={isWorking ? "d22-lab-arm-l" : ""} />
        <circle cx="20.5" cy="22" r="1.5" fill="#f5d0a9" className={isWorking ? "d22-lab-arm-r" : ""} />
        <rect x="7" y="25" width="4" height="7" rx="1.5" fill="#3b4252" />
        <rect x="13" y="25" width="4" height="7" rx="1.5" fill="#3b4252" />
        <rect x="6" y="31" width="5.5" height="3" rx="1" fill="#2e3440" />
        <rect x="12.5" y="31" width="5.5" height="3" rx="1" fill="#2e3440" />
        {isWorking && (
          <g>
            <rect x="8" y="4.5" width="3.5" height="2.5" rx="1" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.7" />
            <rect x="12.5" y="4.5" width="3.5" height="2.5" rx="1" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.7" />
            <line x1="11.5" y1="5.5" x2="12.5" y2="5.5" stroke={accent} strokeWidth="0.4" opacity="0.5" />
          </g>
        )}
        {relaxing && (
          <g transform="translate(19, 18)">
            <rect x="0" y="0" width="4" height="5" rx="0.8" fill="white" stroke="#bbb" strokeWidth="0.3" />
            <path d="M4,1 Q6,1 6,3 Q6,5 4,5" fill="none" stroke="#bbb" strokeWidth="0.5" />
            <rect x="0.5" y="0.5" width="3" height="1.5" rx="0.3" fill="#6f4e37" opacity="0.6" />
            <path d="M1.5,-1 Q2,-3 1,-4" fill="none" stroke="#999" strokeWidth="0.3" opacity="0.4" className="d22-lab-steam" />
            <path
              d="M3,-1 Q3.5,-3.5 2.5,-5"
              fill="none"
              stroke="#999"
              strokeWidth="0.3"
              opacity="0.3"
              className="d22-lab-steam"
              style={{ animationDelay: "0.5s" }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}

function ServerRoomArt() {
  return (
    <g>
      {[0, 1, 2].map((rack) => (
        <g transform={`translate(${8 + rack * 22}, 8)`} key={rack}>
          <rect x="0" y="0" width="16" height="55" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((unit) => (
            <g key={unit}>
              <rect x="2" y={3 + unit * 6.5} width="12" height="4.5" rx="0.5" fill="var(--accent-primary)" opacity="0.22" />
              <circle
                cx={12}
                cy={5 + unit * 6.5}
                r="1.2"
                className="d22-lab-server-led"
                style={{ animationDelay: `${(rack * 8 + unit) * 0.15}s` }}
              />
            </g>
          ))}
        </g>
      ))}
      <line x1="4" y1="68" x2="70" y2="68" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.35" />
    </g>
  );
}

function ResearchLabArt() {
  return (
    <g>
      <rect x="6" y="10" width="60" height="18" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      <g transform="translate(12, 4)">
        <rect x="0" y="6" width="8" height="2" rx="0.5" fill="var(--text-muted)" opacity="0.7" />
        <rect x="2.5" y="0" width="3" height="8" rx="0.5" fill="var(--text-muted)" opacity="0.65" />
        <rect x="1" y="0" width="6" height="2" rx="0.5" fill="var(--accent-primary)" opacity="0.5" />
        <circle cx="4" cy="1" r="1.5" fill="var(--accent-primary)" opacity="0.4" />
      </g>
      {[0, 1, 2].map((beaker) => (
        <g transform={`translate(${30 + beaker * 12}, 4)`} key={beaker}>
          <path d="M1,8 L0,0 L6,0 L5,8 Z" fill="none" stroke="var(--accent-primary)" strokeWidth="0.7" opacity="0.55" />
          <rect x="0.5" y={4 - beaker} width="5" height={4 + beaker} rx="0.3" fill="var(--accent-primary)" opacity={0.18 + beaker * 0.06} />
          <circle
            cx="3"
            cy={6 - beaker * 0.5}
            r="0.8"
            fill="var(--accent-primary)"
            opacity="0.35"
            className="d22-lab-bubble"
            style={{ animationDelay: `${beaker * 0.7}s` }}
          />
        </g>
      ))}
      <rect x="6" y="38" width="30" height="25" rx="2" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      <rect x="8" y="40" width="26" height="14" rx="1" fill="var(--accent-primary)" opacity="0.1" />
      <text x="21" y="62" textAnchor="middle" fill="var(--text-muted)" fontSize="3" fontFamily="var(--mono)" opacity="0.4">
        FUME HOOD
      </text>
      <rect x="42" y="38" width="24" height="18" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <line x1="44" y1="43" x2="58" y2="43" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.35" />
      <line x1="44" y1="47" x2="54" y2="47" stroke="var(--accent-secondary)" strokeWidth="0.6" opacity="0.3" />
      <line x1="44" y1="51" x2="62" y2="51" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.25" />
    </g>
  );
}

function OfficeArt() {
  return (
    <g>
      <rect x="10" y="16" width="36" height="20" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      <rect x="18" y="10" width="18" height="12" rx="1" fill="var(--accent-primary-dim)" stroke="var(--border)" strokeWidth="0.8" />
      <rect x="24" y="22" width="6" height="3" rx="0.3" fill="var(--text-muted)" opacity="0.55" />
      <rect x="20" y="12" width="14" height="8" rx="0.5" fill="var(--accent-primary)" opacity="0.15" />
      <rect x="20" y="27" width="14" height="4" rx="0.5" fill="var(--text-muted)" opacity="0.45" />
      <circle cx="28" cy="44" r="7" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <circle cx="28" cy="44" r="4" fill="var(--accent-secondary)" opacity="0.2" />
      <rect x="54" y="10" width="12" height="40" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      {[0, 1, 2].map((shelf) => (
        <g key={shelf}>
          <rect x="56" y={13 + shelf * 12} width="8" height="9" rx="0.5" fill="var(--accent-secondary)" opacity="0.2" />
          <rect x="59" y={16 + shelf * 12} width="2" height="1" rx="0.3" fill="var(--text-muted)" opacity="0.55" />
        </g>
      ))}
      <circle cx="8" cy="56" r="4" fill="#22c55e" opacity="0.45" />
      <rect x="6.5" y="56" width="3" height="6" rx="0.5" fill="#8B4513" opacity="0.55" />
    </g>
  );
}

function CommsArt() {
  return (
    <g>
      {[0, 1, 2].map((screen) => (
        <rect key={screen} x={6 + screen * 22} y="8" width="18" height="12" rx="1" fill="var(--accent-primary-dim)" stroke="var(--border)" strokeWidth="0.8" />
      ))}
      {[0, 1, 2].map((screen) => (
        <g key={`content-${screen}`}>
          <rect x={8 + screen * 22} y="10" width="14" height="2" rx="0.3" fill="var(--accent-primary)" opacity="0.2" />
          <rect x={8 + screen * 22} y="13" width="10" height="1.5" rx="0.3" fill="var(--accent-primary)" opacity="0.15" />
          <rect x={8 + screen * 22} y="16" width="12" height="1.5" rx="0.3" fill="var(--accent-secondary)" opacity="0.15" />
        </g>
      ))}
      <rect x="4" y="22" width="64" height="14" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.8" />
      <g transform="translate(54, 24)">
        <path d="M0,6 Q0,0 5,0 Q10,0 10,6" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" opacity="0.6" />
        <circle cx="0" cy="6" r="2" fill="var(--text-muted)" opacity="0.45" />
        <circle cx="10" cy="6" r="2" fill="var(--text-muted)" opacity="0.45" />
      </g>
      <rect x="10" y="42" width="52" height="22" rx="2" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <path
        d="M14,53 Q18,46 22,53 Q26,60 30,53 Q34,46 38,53 Q42,60 46,53 Q50,46 54,53 Q58,60 58,53"
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="1"
        opacity="0.45"
        className="d22-lab-wave"
      />
      <g transform="translate(62, 44)">
        <line x1="3" y1="20" x2="3" y2="4" stroke="var(--text-muted)" strokeWidth="1" opacity="0.55" />
        <circle cx="3" cy="3" r="2" fill="none" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.4" className="d22-lab-antenna-pulse" />
        <circle
          cx="3"
          cy="3"
          r="4"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="0.4"
          opacity="0.2"
          className="d22-lab-antenna-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </g>
    </g>
  );
}

function LoungeArt() {
  return (
    <g>
      <rect x="6" y="8" width="42" height="16" rx="3" fill="var(--accent-secondary)" opacity="0.28" stroke="var(--border)" strokeWidth="0.6" />
      <rect x="8" y="10" width="12" height="12" rx="2" fill="var(--accent-secondary)" opacity="0.15" />
      <rect x="34" y="10" width="12" height="12" rx="2" fill="var(--accent-secondary)" opacity="0.15" />
      <rect x="14" y="30" width="26" height="12" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.6" />
      <rect x="16" y="32" width="6" height="4" rx="0.3" fill="var(--accent-primary)" opacity="0.22" transform="rotate(-5 19 34)" />
      <rect x="24" y="33" width="5" height="3.5" rx="0.3" fill="var(--accent-secondary)" opacity="0.22" transform="rotate(8 26 35)" />
      <g transform="translate(44, 34)">
        <rect x="0" y="5" width="7" height="9" rx="1" fill="#8B4513" opacity="0.5" />
        <ellipse cx="3.5" cy="3" rx="6" ry="5" fill="#22c55e" opacity="0.4" />
        <ellipse cx="5" cy="5" rx="4" ry="3" fill="#16a34a" opacity="0.3" />
      </g>
      <g transform="translate(2, 50)">
        <rect x="0" y="0" width="6" height="14" rx="0.5" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="1" y="1" width="4" height="6" rx="0.5" fill="var(--accent-primary)" opacity="0.2" />
        <circle cx="3" cy="3" r="0.8" fill="var(--accent-primary)" opacity="0.35" className="d22-lab-bubble" />
      </g>
      <rect x="44" y="50" width="10" height="18" rx="1" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="0.5" />
      <rect x="45" y="52" width="8" height="5" rx="0.3" fill="var(--accent-primary)" opacity="0.15" />
      <rect x="45" y="58" width="8" height="5" rx="0.3" fill="var(--accent-secondary)" opacity="0.15" />
    </g>
  );
}

const roomArt: Record<RoomId, () => JSX.Element> = {
  server: ServerRoomArt,
  lab: ResearchLabArt,
  office: OfficeArt,
  comms: CommsArt,
  lounge: LoungeArt,
};

function Room({ id, meta }: { id: RoomId; meta: (typeof rooms)[RoomId] }) {
  const Art = roomArt[id];
  return (
    <div
      className="d22-lab-room"
      style={{ left: `${meta.x}%`, top: `${meta.y}%`, width: `${meta.w}%`, height: `${meta.h}%` }}
    >
      <svg className="d22-lab-room-svg" viewBox="0 0 72 72" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="72" height="72" rx="3" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="0.8" />
        {Art && <Art />}
      </svg>
      <div className={`d22-lab-room-label ${id === "lounge" ? "d22-lab-room-label-lounge" : ""}`}>
        {meta.label}
      </div>
    </div>
  );
}

function Corridors() {
  return (
    <svg className="d22-lab-corridors" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="35" y="15" width="30" height="4" fill="var(--bg-card)" opacity="0.4" />
      <rect x="35" y="68" width="30" height="4" fill="var(--bg-card)" opacity="0.4" />
      <rect x="35" y="15" width="4" height="57" fill="var(--bg-card)" opacity="0.4" />
      <rect x="61" y="15" width="4" height="57" fill="var(--bg-card)" opacity="0.4" />
    </svg>
  );
}

function LabHeader() {
  const activeCount = agents.filter((agent) => agent.status.agent_mode === "running").length;
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
          {activeCount} active
        </span>
        <span className="d22-lab-header-stat">
          <span className="d22-lab-header-stat-dot" style={{ background: "#eab308" }} />
          {agents.length - activeCount} idle
        </span>
      </div>
    </div>
  );
}

function FloorAgent({ agent }: { agent: Agent }) {
  const isWorking = agent.status.agent_mode === "running";
  const roomId = agentRooms[agent.profile.slug] ?? "server";
  const fallbackLocation = isWorking ? rooms[roomId]?.label ?? "Server Room" : "Lounge";
  const position = isWorking
    ? workPositions[roomId]
    : loungePositions[agent.profile.slug] ?? { x: 50, y: 50 };
  const modeColor = modeColors[agent.status.agent_mode];
  const card = hoverCards[agent.profile.slug];
  const cardDirection = position.y > 54 ? "d22-lab-hover-card-up" : "d22-lab-hover-card-down";

  return (
    <div
      className="d22-lab-agent"
      tabIndex={0}
      aria-label={`${agent.profile.display_name} status`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition:
          "left 1.2s cubic-bezier(0.25, 1, 0.5, 1), top 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <div
        className={`d22-lab-hover-card ${cardDirection}`}
        style={{ "--card-accent": modeColor } as React.CSSProperties}
      >
        <div className="d22-lab-card d22-lab-card-popover">
          <div className="d22-lab-card-top">
            <span className="d22-lab-card-dot" style={{ background: modeColor }} />
            <span className="d22-lab-card-name">
              {card?.displayName ?? agent.profile.display_name}
            </span>
            <span className="d22-lab-card-mode" style={{ color: modeColor }}>
              {agent.status.agent_mode}
            </span>
          </div>
          <div className="d22-lab-card-persona">
            {card?.persona ?? agent.profile.persona_description}
          </div>
          <div className="d22-lab-card-location">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1C5 1 3 3.5 3 6c0 4 5 9 5 9s5-5 5-9c0-2.5-2-5-5-5z" />
              <circle cx="8" cy="6" r="1.5" />
            </svg>
            {card?.location ?? fallbackLocation}
          </div>
          <div className="d22-lab-card-activity">{card?.activity ?? agent.status.activity_label}</div>
          <div className="d22-lab-card-meta">
            <span>{agent.status.sentiment}</span>
            <span>
              {agent.status.running_since
                ? `${uptime(agent.status.running_since)} uptime`
                : timeAgo(agent.status.last_heartbeat)}
            </span>
            <span>{agent.profile.runs} runs</span>
          </div>
        </div>
      </div>
      <div
        className="d22-lab-agent-pip"
        style={{ background: modeColor, boxShadow: `0 0 6px ${modeColor}60` }}
      />
      <AgentSprite
        slug={agent.profile.slug}
        isWorking={isWorking}
        sentiment={agent.status.sentiment}
      />
      <div className="d22-lab-agent-tag">{agent.profile.slug}</div>
    </div>
  );
}

function AgentCards({
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
        const modeColor = modeColors[agent.status.agent_mode];
        const isWorking = agent.status.agent_mode === "running";
        const roomId = agentRooms[agent.profile.slug];
        const location = isWorking ? rooms[roomId]?.label : "Lounge";
        const isActive = selected === agent.profile.agent_id;
        return (
          <div
            className={`d22-lab-card ${isActive ? "d22-lab-card-active" : ""}`}
            onClick={() => onSelect(isActive ? null : agent.profile.agent_id)}
            style={{ "--card-accent": modeColor } as React.CSSProperties}
            key={agent.profile.agent_id}
          >
            <div className="d22-lab-card-top">
              <span className="d22-lab-card-dot" style={{ background: modeColor }} />
              <span className="d22-lab-card-name">{agent.profile.display_name}</span>
              <span className="d22-lab-card-mode" style={{ color: modeColor }}>
                {agent.status.agent_mode}
              </span>
            </div>
            <div className="d22-lab-card-persona">{agent.profile.persona_description}</div>
            <div className="d22-lab-card-location">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 1C5 1 3 3.5 3 6c0 4 5 9 5 9s5-5 5-9c0-2.5-2-5-5-5z" />
                <circle cx="8" cy="6" r="1.5" />
              </svg>
              {location}
            </div>
            <div className="d22-lab-card-activity">{agent.status.activity_label}</div>
            <div className="d22-lab-card-meta">
              <span>{agent.status.sentiment}</span>
              <span>
                {agent.status.running_since
                  ? `${uptime(agent.status.running_since)} uptime`
                  : timeAgo(agent.status.last_heartbeat)}
              </span>
              <span>{agent.profile.runs} runs</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityLog() {
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
        {activityLog.map((entry, index) => {
          const agent = findAgent(entry.agent_id);
          const modeColor = modeColors[agent?.status.agent_mode ?? "offline"];
          const name = agent?.profile.display_name ?? entry.agent_id;
          return (
            <div
              className="d22-lab-log-row"
              style={{ animationDelay: `${index * 0.04}s` }}
              key={entry.log_id}
            >
              <span className="d22-lab-log-col-time d22-lab-log-time">{timeAgo(entry.logged_at)}</span>
              <span className="d22-lab-log-col-agent">
                <span
                  className="d22-lab-log-agent"
                  style={{
                    color: modeColor,
                    borderColor: `${modeColor}4d`,
                    background: `${modeColor}14`,
                  }}
                >
                  {name}
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

function AgentLab() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="d22-lab-wrap">
      <LabHeader />
      <div className="d22-lab-layout">
        <div className="d22-lab-floor">
          <Corridors />
          {(Object.entries(rooms) as [RoomId, (typeof rooms)[RoomId]][]).map(([id, meta]) => (
            <Room id={id} meta={meta} key={id} />
          ))}
          {agents.map((agent) => (
            <FloorAgent agent={agent} key={agent.profile.agent_id} />
          ))}
        </div>
        <AgentCards selected={selected} onSelect={setSelected} className="d22-lab-cards-mobile" />
      </div>
      <ActivityLog />
    </div>
  );
}

export default function AgentLabSection({ reveal }: { reveal: RevealState }) {
  return (
    <section id="agents" className="d22-section">
      <div ref={reveal.ref} className={`d22-reveal ${reveal.visible ? "visible" : ""}`}>
        <SectionHeader config={{ label: "AGENT NETWORK", title: "Helpers", evalTag: "swarm · online" }} />
        <div className="d22-helpers-note" role="note" aria-live="polite">
          <p className="d22-helpers-note-title">Helpers section is in progress.</p>
          <p className="d22-helpers-note-body">
            View helpers by hovering each agent on desktop, or using the helper cards below the map
            on mobile.
          </p>
        </div>
        <AgentLab />
      </div>
    </section>
  );
}
