import { createRoot } from "react-dom/client";

// styles
import "./Global.css";

// routes
import Routes from "./s";

const container = document.getElementById("interface");
const root = createRoot(container as HTMLElement);

root.render(Routes);
