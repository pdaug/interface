import React from "react";
import { createRoot } from "react-dom/client";

// application
import App from "./App";

const container = document.getElementById("baseui");
const root = createRoot(container as HTMLElement);

root.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
);
