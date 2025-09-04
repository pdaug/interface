import { createRoot } from "react-dom/client";

// styles
import "./main.css";
import "@xyflow/react/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// routes
import Routes from "./Routes";

const container = document.getElementById("interface");
const root = createRoot(container as HTMLElement);

root.render(Routes);
