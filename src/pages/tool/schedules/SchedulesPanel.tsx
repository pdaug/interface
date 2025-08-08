import React, { useEffect, useState } from "react";
import { endOfDay, format, isSameDay, startOfDay, subDays } from "date-fns";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Agenda, AgendaDate } from "../../../components/Agendas/Agenda";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

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

const SchedulesPanel = function () {
  const t = useTranslate();
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
  const [selected, setSelected] = useState<TypeSchedule[]>([]);
  const [schedules, setSchedules] = useState<TypeSchedule[]>([]);

  useEffect(function () {
    setSchedules([
      {
        id: "1",
        title: "Proin ornare quam sit amet augue porttitor consectetur.",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T12:00:00Z"),
        end: new Date("2025-08-01T13:00:00Z"),
      },
      {
        id: "2",
        title:
          " Sed vitae nibh vitae dui malesuada tristique. Suspendisse bibendum diam nulla, eu feugiat dui consequat nec.",
        category: "note",
        priority: "medium",
        description:
          " Sed vitae nibh vitae dui malesuada tristique. Suspendisse bibendum diam nulla, eu feugiat dui consequat nec.",
        start: new Date("2025-08-01T14:00:00Z"),
        end: new Date("2025-08-01T14:30:00Z"),
      },
      {
        id: "3",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T15:00:00Z"),
        end: new Date("2025-08-01T16:30:00Z"),
      },
      {
        id: "4",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T18:00:00Z"),
        end: new Date("2025-08-01T18:30:00Z"),
      },
      {
        id: "5",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "6",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
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

      <Horizontal internal={1} className="flex1">
        <Vertical internal={1} styles={{ width: "65%" }}>
          <Agenda
            selectable
            endAccessor="end"
            events={schedules}
            defaultView="month"
            startAccessor="start"
            views={["month"]}
            onSelectEvent={function (schedule) {
              setForm(schedule as TypeSchedule);
              setSelected([]);
              return;
            }}
            onShowMore={function (event) {
              setSelected(event as TypeSchedule[]);
              return;
            }}
            onSelectSlot={function (slot) {
              setSelected([]);
              if (isSameDay(slot.start, slot.end)) {
                setForm({
                  ...initialForm,
                  start: startOfDay(slot.start),
                  end: endOfDay(slot.start),
                });
                return;
              }
              setForm({
                ...initialForm,
                start: startOfDay(slot.start),
                end: endOfDay(subDays(slot.end, 1)),
              });
              return;
            }}
          />
        </Vertical>

        <Vertical internal={1} className="flex1 overflowHidden">
          {!selected.length ? (
            <React.Fragment>
              <AgendaDate
                date={form.start}
                title={form.title}
                description={form.description}
                start={form.start}
                end={form.end}
              />

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
                    height={2}
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
                      options={ScheduleCategoriesOptions?.map(
                        function (category) {
                          return {
                            id: category,
                            value: category,
                            text: category,
                          };
                        },
                      )}
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
                      options={SchedulePrioritiesOptions?.map(
                        function (priority) {
                          return {
                            id: priority,
                            value: priority,
                            text: priority,
                          };
                        },
                      )}
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
                      newForm.start = new Date(
                        event.currentTarget?.value || "",
                      );
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
                  <Button
                    category={form.id ? "Info" : "Success"}
                    text={form.id ? "Edit" : "Save"}
                  />
                </Vertical>
              </Wrapper>
            </React.Fragment>
          ) : (
            selected?.map(function (schedule) {
              return (
                <AgendaDate
                  key={schedule.id}
                  date={schedule.start}
                  title={
                    <a
                      href="#"
                      onClick={function () {
                        setForm(schedule);
                        setSelected([]);
                        return;
                      }}
                    >
                      {schedule.title}
                    </a>
                  }
                  description={schedule.description}
                  start={schedule.start}
                  end={schedule.end}
                />
              );
            })
          )}
        </Vertical>
      </Horizontal>
    </React.Fragment>
  );
};

export default SchedulesPanel;
