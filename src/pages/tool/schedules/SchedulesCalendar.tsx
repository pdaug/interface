import React, { useEffect, useState } from "react";
import { endOfDay, format, startOfDay } from "date-fns";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputSelect,
} from "../../../components/inputs/Input";
import Agenda from "../../../components/Agendas/Agenda";
import Wrapper from "../../../components/wrapper/Wrapper";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Button from "../../../components/buttons/Button";
import useDateTime from "../../../hooks/useDateTime";

const ScheduleCategoriesOptions = [
  "task",
  "note",
  "event",
  "remind",
  "deadline",
  "work",
  "reserved",
  "meeting",
];

export type TypeScheduleCategory =
  | "task"
  | "note"
  | "event"
  | "remind"
  | "deadline"
  | "work"
  | "reserved"
  | "meeting";

const SchedulePrioritiesOptions = ["low", "medium", "high"];

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

const SchedulesCalendar = function () {
  const t = useTranslate();
  const { instanceTime } = useDateTime();
  const { workspaceId, workspaces } = useSystem();

  const initialForm: TypeSchedule = {
    id: "",
    title: "",
    category: "note",
    priority: "medium",
    description: "",
    start: startOfDay(new Date()),
    end: new Date(),
  };

  const [form, setForm] = useState<TypeSchedule>(initialForm);
  const [schedules, setSchedules] = useState<TypeSchedule[]>([]);

  useEffect(function () {
    setSchedules([
      {
        id: "123",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T12:00:00Z"),
        end: new Date("2025-08-01T13:00:00Z"),
      },
    ]);
    return;
  }, []);

  return (
    <React.Fragment>
      <Horizontal>
        <h2>
          <Breadcrumb
            links={[
              {
                id: "workspace",
                label:
                  workspaces.find(function (workspace) {
                    return workspace.id === workspaceId;
                  })?.name || "",
                url: "/f/",
              },
              {
                id: "schedules",
                label: t.schedule.schedules,
                url: "/f/schedules",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1} className="flex flex1">
        <Agenda
          selectable
          className="flex1"
          endAccessor="end"
          events={schedules}
          defaultView="month"
          startAccessor="start"
          views={["month", "week"]}
          onSelectEvent={function (schedule) {
            setForm(schedule as TypeSchedule);
            return;
          }}
          onSelectSlot={function (slot) {
            setForm({
              ...initialForm,
              start: startOfDay(slot.start),
              end: endOfDay(slot.start),
            });
            return;
          }}
        />

        <Vertical internal={1} styles={{ width: 360 }}>
          <Wrapper styles={{ flex: "none" }}>
            <Horizontal internal={0.6} className="items-center">
              <div
                style={{
                  border: "1px solid var(--borderColor)",
                  borderRadius: "var(--borderRadius)",
                  overflow: "hidden",
                  minWidth: 64,
                }}
              >
                <div
                  style={{
                    background: "var(--backgroundColor)",
                    backgroundColor: "var(--backgroundColor)",
                    borderBottom: "1px solid var(--borderColor)",
                    fontSize: "var(--textSmall)",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {format(form.start, "MMM")}
                </div>
                <div
                  style={{
                    fontSize: "var(--textSubtitle)",
                    fontWeight: "bold",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {format(form.start, "dd")}
                </div>
              </div>
              <Vertical internal={0.2} className="ellipses">
                <div className="ellipses">{form.title || "no_title"}</div>
                <div
                  className="ellipses"
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {form.description || "no_description"}
                </div>
                <div
                  className="ellipses"
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {instanceTime(form.start, true)} -{" "}
                  {instanceTime(form.end, true)}
                </div>
              </Vertical>
            </Horizontal>
          </Wrapper>

          <Wrapper styles={{ flex: "none" }}>
            <Vertical internal={1}>
              <Input
                required
                min={3}
                max={64}
                name="title"
                label="Title"
                value={form.title}
                id="calendar_title"
                placeholder="e.g. Meeting"
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.title = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <InputText
                max={256}
                height={4}
                name="description"
                label="Description"
                value={form.description}
                id="calendar_description"
                placeholder="Type here your description about this schedule"
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.description = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="category"
                  label="Category"
                  id="calendar_category"
                  value={form.category}
                  empty={t.stacks.no_items}
                  options={ScheduleCategoriesOptions?.map(function (category) {
                    return {
                      id: category,
                      value: category,
                      text: category,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.category = (event.currentTarget?.value ||
                      "") as TypeScheduleCategory;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="priority"
                  label="Priority"
                  id="calendar_priority"
                  value={form.priority}
                  empty={t.stacks.no_items}
                  options={SchedulePrioritiesOptions?.map(function (priority) {
                    return {
                      id: priority,
                      value: priority,
                      text: priority,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.priority = (event.currentTarget?.value ||
                      "") as TypeSchedulePriority;
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Input
                required
                name="start"
                label="Start date"
                id="calendar_start"
                type="datetime-local"
                placeholder="yyyy-MM-dd"
                value={format(form.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.start = new Date(event.currentTarget?.value || "");
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                required
                name="end"
                label="End date"
                id="calendar_end"
                type="datetime-local"
                placeholder="yyyy-MM-dd"
                value={format(form.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.end = new Date(event.currentTarget?.value || "");
                  setForm(newForm);
                  return;
                }}
              />
              <Button category="Success" text="Save" />
            </Vertical>
          </Wrapper>
        </Vertical>
      </Horizontal>
    </React.Fragment>
  );
};

export default SchedulesCalendar;
