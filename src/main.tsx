import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./site.css";

// The build prerenders the page into #root (scripts/prerender.mjs), so the
// client hydrates it; the dev server serves an empty #root and renders fresh.
const container = document.getElementById("root")!;
if (container.firstElementChild) hydrateRoot(container, <App />);
else createRoot(container).render(<App />);
