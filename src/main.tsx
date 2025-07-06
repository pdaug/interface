import { createRoot } from "react-dom/client";

// styles
import "./main.css";

// routes
import Routes from "./Routes";

const container = document.getElementById("interface");
const root = createRoot(container as HTMLElement);

root.render(Routes);
