import { useEffect } from "react";

// styles
import "./Version.css";

// hooks
import useSystem from "../../hooks/useSystem";

// package
import { version as versionFrontend } from "../../../package.json";

const Version = function () {
  const { version: versionBackend } = useSystem();

  useEffect(function () {
    console.info("Version", {
      Frontend: Number(versionFrontend),
      Backend: versionBackend,
    });
    return;
  }, []);

  return (
    <div className="version">
      <span>{versionFrontend}</span>
      <span>_</span>
      <span>{versionBackend}</span>
    </div>
  );
};

export default Version;
