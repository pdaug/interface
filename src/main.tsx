import React from "react";
import { createRoot } from "react-dom/client";

// styles
import "./Global.css";

const container = document.getElementById("fz");
const root = createRoot(container as HTMLElement);

root.render(
  <React.Fragment>
    <h1>hello</h1>
  </React.Fragment>,
);
