export type TypeScheduleCategory =
  | "task"
  | "note"
  | "event"
  | "remind"
  | "deadline"
  | "work"
  | "reserved"
  | "meeting";

export type TypeSchedulePriority = "low" | "medium" | "high";

export type TypeSchedule = {
  id?: string;
  title: string;
  description: string;
  category: TypeScheduleCategory;
  priority: TypeSchedulePriority;
  start: Date;
  end: Date;
};
