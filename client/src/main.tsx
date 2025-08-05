import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./utils/connection-stabilizer"; // Initialize THAENOS healing

createRoot(document.getElementById("root")!).render(<App />);
