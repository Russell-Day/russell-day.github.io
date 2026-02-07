import SectionHeader from "../SectionHeader";
import { type RevealState } from "../types";
import AgentDashboard from "./AgentDashboard";
import "./styles.css";

type AgentDashboardSectionProps = {
  reveal: RevealState;
};

export default function AgentDashboardSection({ reveal }: AgentDashboardSectionProps) {
  return (
    <section id="agents" className="d22-section">
      <div
        ref={reveal.ref}
        className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
      >
        <SectionHeader
          config={{
            label: "AGENT NETWORK",
            title: "Helpers",
            basePair: "A-G",
          }}
        />

        <AgentDashboard />
      </div>
    </section>
  );
}
