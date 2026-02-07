export type AgentMode = "idle" | "running" | "paused" | "offline";

export type AgentSentiment =
  | "focused"
  | "busy"
  | "curious"
  | "satisfied"
  | "overwhelmed"
  | "bored"
  | "resting";

export interface AgentProfile {
  agent_id: string;
  slug: string;
  display_name: string;
  persona_description: string;
  avatar_key: string;
  is_public: boolean;
  runs: number;
}

export interface AgentStatus {
  agent_id: string;
  agent_mode: AgentMode;
  sentiment: AgentSentiment;
  activity_label: string;
  motion_script_key: string;
  running_since: string | null;
  last_heartbeat: string;
  updated_at: string;
}

export interface AgentActivityEntry {
  log_id: number;
  agent_id: string;
  summary: string;
  sentiment: AgentSentiment;
  logged_at: string;
}

export interface AgentData {
  profile: AgentProfile;
  status: AgentStatus;
}
