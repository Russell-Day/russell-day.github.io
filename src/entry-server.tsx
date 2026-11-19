// Server entry for the build's prerender step (scripts/prerender.mjs): the
// page as HTML, and the structured data about its owner.
import { renderToString } from "react-dom/server";
import App from "./App";
import { personJsonLd } from "./components/seo";

export function render(): string {
  return renderToString(<App />);
}

export { personJsonLd };
