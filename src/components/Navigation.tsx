import { HelixLogo, MoonIcon, SunIcon } from "./icons";
import { type NavLink, type Theme } from "./types";

type NavigationProps = {
  scrolled: boolean;
  theme: Theme;
  menuOpen: boolean;
  navLinks: NavLink[];
  brandName: string;
  ctaLabel: string;
  onToggleTheme: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export default function Navigation({
  scrolled,
  theme,
  menuOpen,
  navLinks,
  brandName,
  ctaLabel,
  onToggleTheme,
  onToggleMenu,
  onCloseMenu,
}: NavigationProps) {
  return (
    <>
      <nav className={`d22-nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#hero" className="d22-nav-logo" onClick={onCloseMenu}>
          <HelixLogo theme={theme} />
          {brandName}
        </a>

        <div className="d22-nav-right">
          <ul className="d22-nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            <li>
              <a href="#contact" className="d22-nav-cta">
                {ctaLabel}
              </a>
            </li>
          </ul>

          <button
            className="d22-theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <SunIcon />
            <MoonIcon />
          </button>

          <button
            className={`d22-hamburger ${menuOpen ? "open" : ""}`}
            onClick={onToggleMenu}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`d22-mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={onCloseMenu}>
            {link.label}
          </a>
        ))}
        <a href="#contact" onClick={onCloseMenu}>
          {ctaLabel}
        </a>
      </div>
    </>
  );
}
