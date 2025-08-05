
import { createRoot } from "react-dom/client";
import EmergencyDashboard from "./pages/emergency-dashboard";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<EmergencyDashboard />);
} else {
  console.error("Root element not found");
}
