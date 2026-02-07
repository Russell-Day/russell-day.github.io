import {
  type AgentData,
  type AgentActivityEntry,
} from "./types";

const now = new Date();
function minutesAgo(m: number) {
  return new Date(now.getTime() - m * 60000).toISOString();
}

export const agents: AgentData[] = [
  {
    profile: {
      agent_id: "a1",
      slug: "main",
      display_name: "Main Agent",
      persona_description: "Orchestrator",
      avatar_key: "main",
      is_public: true,
      runs: 847,
    },
    status: {
      agent_id: "a1",
      agent_mode: "running",
      sentiment: "focused",
      activity_label: "Coordinating nightly batch",
      motion_script_key: "steady_sweep",
      running_since: minutesAgo(134),
      last_heartbeat: minutesAgo(2),
      updated_at: minutesAgo(2),
    },
  },
  {
    profile: {
      agent_id: "a2",
      slug: "canvas",
      display_name: "Canvas Agent",
      persona_description: "Studious",
      avatar_key: "canvas",
      is_public: true,
      runs: 312,
    },
    status: {
      agent_id: "a2",
      agent_mode: "running",
      sentiment: "curious",
      activity_label: "Reviewing assignment deadlines",
      motion_script_key: "wander_explore",
      running_since: minutesAgo(92),
      last_heartbeat: minutesAgo(1),
      updated_at: minutesAgo(1),
    },
  },
  {
    profile: {
      agent_id: "a3",
      slug: "calendar",
      display_name: "Calendar Agent",
      persona_description: "Organized",
      avatar_key: "calendar",
      is_public: true,
      runs: 1204,
    },
    status: {
      agent_id: "a3",
      agent_mode: "idle",
      sentiment: "satisfied",
      activity_label: "Last sync: 12 events processed",
      motion_script_key: "idle_orbit",
      running_since: null,
      last_heartbeat: minutesAgo(8),
      updated_at: minutesAgo(8),
    },
  },
  {
    profile: {
      agent_id: "a4",
      slug: "gmail",
      display_name: "Gmail Agent",
      persona_description: "Restless",
      avatar_key: "gmail",
      is_public: true,
      runs: 2031,
    },
    status: {
      agent_id: "a4",
      agent_mode: "running",
      sentiment: "busy",
      activity_label: "Triaging inbox \u2014 47 unread",
      motion_script_key: "dart_between",
      running_since: minutesAgo(45),
      last_heartbeat: minutesAgo(1),
      updated_at: minutesAgo(1),
    },
  },
];

export const activityLog: AgentActivityEntry[] = [
  {
    log_id: 1,
    agent_id: "a4",
    summary: "Sorted 23 promotional emails to archive",
    sentiment: "busy",
    logged_at: minutesAgo(3),
  },
  {
    log_id: 2,
    agent_id: "a1",
    summary: "Dispatched Canvas check to review queue",
    sentiment: "focused",
    logged_at: minutesAgo(7),
  },
  {
    log_id: 3,
    agent_id: "a2",
    summary: "Found 2 upcoming deadlines this week",
    sentiment: "curious",
    logged_at: minutesAgo(12),
  },
  {
    log_id: 4,
    agent_id: "a3",
    summary: "Synced 12 calendar events successfully",
    sentiment: "satisfied",
    logged_at: minutesAgo(18),
  },
  {
    log_id: 5,
    agent_id: "a4",
    summary: "Flagged 3 messages as high-priority",
    sentiment: "focused",
    logged_at: minutesAgo(22),
  },
  {
    log_id: 6,
    agent_id: "a1",
    summary: "Health check passed — all agents nominal",
    sentiment: "satisfied",
    logged_at: minutesAgo(30),
  },
  {
    log_id: 7,
    agent_id: "a2",
    summary: "Downloaded updated syllabus for EECS 281",
    sentiment: "curious",
    logged_at: minutesAgo(45),
  },
  {
    log_id: 8,
    agent_id: "a3",
    summary: "Detected 1 scheduling conflict, resolved",
    sentiment: "focused",
    logged_at: minutesAgo(52),
  },
  {
    log_id: 9,
    agent_id: "a4",
    summary: "Processed 58 messages in last batch",
    sentiment: "busy",
    logged_at: minutesAgo(68),
  },
  {
    log_id: 10,
    agent_id: "a1",
    summary: "Initiated nightly coordination sequence",
    sentiment: "focused",
    logged_at: minutesAgo(134),
  },
];

export function getAgentById(id: string) {
  return agents.find((a) => a.profile.agent_id === id);
}

export function formatTimeAgo(iso: string): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m ago`;
}

export function formatUptime(iso: string | null): string {
  if (!iso) return "\u2014";
  const diff = now.getTime() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

export const sentimentEmoji: Record<string, string> = {
  focused: "\u25C9",
  busy: "\u26A1",
  curious: "\u2609",
  satisfied: "\u2713",
  overwhelmed: "\u2248",
  bored: "\u2013",
  resting: "\u223F",
};

export const modeColors: Record<string, string> = {
  running: "#22c55e",
  idle: "#eab308",
  paused: "#f97316",
  offline: "#6b7280",
};
