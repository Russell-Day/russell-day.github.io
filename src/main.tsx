import { createRoot } from "react-dom/client";
import App from "./App";
import "./site.css";

const container = document.getElementById("root")!;
createRoot(container).render(<App />);
