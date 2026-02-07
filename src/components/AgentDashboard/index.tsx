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
        <div className="d22-helpers-note" role="note" aria-live="polite">
          <p className="d22-helpers-note-title">Helpers section is in progress.</p>
          <p className="d22-helpers-note-body">
            View helpers by hovering each agent on desktop, or using the helper cards below the map on mobile.
          </p>
        </div>

        <AgentDashboard />
      </div>
    </section>
  );
}
