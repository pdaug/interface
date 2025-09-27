// types
import { BadgeCategories } from "../components/badges/Badge";

export const ScheduleCategoriesOptions = [
  "task",
  "note",
  "event",
  "remind",
  "deadline",
  "work",
  "reserved",
  "meeting",
];

export const ScheduleCategoriesColors: Record<string, BadgeCategories> = {
  none: "Neutral",
  low: "Success",
  medium: "Info",
  high: "Warning",
  critical: "Danger",
};

export const SchedulePrioritiesOptions = [
  "none",
  "low",
  "medium",
  "high",
  "critical",
];
