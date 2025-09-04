// pages
import automations from "./automations";
import documents from "./documents";
import schedules from "./schedules";

export default [
  {
    path: "documents",
    children: documents,
  },
  {
    path: "schedules",
    children: schedules,
  },
  {
    path: "automations",
    children: automations,
  },
];
