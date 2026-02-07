import { EmailIcon, GitHubIcon, LinkedInIcon } from "./icons";
import SectionHeader from "./SectionHeader";
import {
  type ContactConfig,
  type ContactLink,
  type RevealState,
  type SectionHeaderConfig,
} from "./types";

type ContactSectionProps = {
  reveal: RevealState;
  header: SectionHeaderConfig;
  contact: ContactConfig;
};

function ContactLinkIcon({ type }: { type: ContactLink["type"] }) {
  if (type === "email") return <EmailIcon />;
  if (type === "linkedin") return <LinkedInIcon />;
  return <GitHubIcon />;
}

export default function ContactSection({
  reveal,
  header,
  contact,
}: ContactSectionProps) {
  return (
    <section id="contact" className="d22-section">
      <div
        ref={reveal.ref}
        className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
      >
        <SectionHeader config={header} />
        <div className="d22-contact-wrap">
          <h3 className="d22-contact-heading">{contact.heading}</h3>
          <p className="d22-contact-sub">{contact.subtitle}</p>
          <div className="d22-contact-links">
            {contact.links.map((link) => (
              <a
                key={`${link.type}-${link.label}`}
                href={link.href}
                className="d22-contact-link"
                target={link.type === "email" ? undefined : "_blank"}
                rel={link.type === "email" ? undefined : "noopener noreferrer"}
              >
                <ContactLinkIcon type={link.type} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
