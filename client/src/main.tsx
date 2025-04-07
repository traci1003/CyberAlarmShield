import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Remix icon library
const remixiconLink = document.createElement("link");
remixiconLink.rel = "stylesheet";
remixiconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css";
document.head.appendChild(remixiconLink);

// Import Roboto Mono font for the clock
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap";
document.head.appendChild(fontLink);

// Add metadata
const title = document.createElement("title");
title.textContent = "CyberClock - Cybersecurity Alarm Clock";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
