import React, { useEffect, useState } from "react";
import { endOfDay, format, isSameDay, startOfDay, subDays } from "date-fns";

// types
import {
  TypeSchedule,
  TypeScheduleCategory,
  TypeSchedulePriority,
} from "../../../types/Schedules";

// assets
import {
  ScheduleCategoriesOptions,
  SchedulePrioritiesOptions,
} from "../../../assets/Schedules";

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
        start: new Date("2025-08-10T12:00:00Z"),
        end: new Date("2025-08-10T13:00:00Z"),
      },
      {
        id: "2",
        title:
          " Sed vitae nibh vitae dui malesuada tristique. Suspendisse bibendum diam nulla, eu feugiat dui consequat nec.",
        category: "note",
        priority: "medium",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis sem lorem, fringilla interdum ante vulputate et. In hac habitasse platea dictumst. In ut tellus et dui bibendum sodales nec et velit. Integer quis ipsum sit amet sapien mollis varius eu a ipsum. Nulla id metus facilisis, consequat ipsum at, vestibulum orci. Donec consequat tortor non vehicula feugiat. In dignissim facilisis leo, et iaculis ex placerat ac. Nunc feugiat vulputate orci, nec ornare tellus blandit a. In nibh dui, laoreet vitae egestas quis, placerat eget urna. Sed arcu erat, iaculis non justo nec, pharetra suscipit neque. Sed rhoncus nulla augue, eget malesuada dui congue ut. Aliquam et justo scelerisque diam placerat mollis a sit amet eros. Nullam mollis nunc quis pellentesque aliquet. Vestibulum id vehicula arcu. Vestibulum sit amet justo orci.",
        start: new Date("2025-08-01T14:00:00Z"),
        end: new Date("2025-08-02T14:30:00Z"),
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
      {
        id: "7",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "8",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "9",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "10",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "11",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "12",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "13",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "14",
        title: "Teste",
        category: "note",
        priority: "medium",
        description: "nothing",
        start: new Date("2025-08-01T19:00:00Z"),
        end: new Date("2025-08-01T21:00:00Z"),
      },
      {
        id: "15",
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

      <Horizontal internal={1} className="flex1 overflowHidden">
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
                    value={form.title}
                    id="calendar_title"
                    label={t.schedule.title}
                    placeholder={t.schedule.title_placeholder}
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
                    value={form.description}
                    id="calendar_description"
                    label={t.schedule.description}
                    placeholder={t.schedule.description_placeholder}
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
                      id="calendar_category"
                      value={form.category}
                      empty={t.stacks.no_items}
                      label={t.schedule.category}
                      options={ScheduleCategoriesOptions?.map(
                        function (category) {
                          return {
                            id: category,
                            value: category,
                            text:
                              t.schedule?.[
                                category as keyof typeof t.schedule
                              ] || t.components.unknown,
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
                      id="calendar_priority"
                      value={form.priority}
                      empty={t.stacks.no_items}
                      label={t.schedule.priority}
                      options={SchedulePrioritiesOptions?.map(
                        function (priority) {
                          return {
                            id: priority,
                            value: priority,
                            text:
                              t.schedule?.[
                                priority as keyof typeof t.schedule
                              ] || t.components.unknown,
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
                    id="calendar_start"
                    type="datetime-local"
                    placeholder="yyyy-MM-dd"
                    label={t.schedule.start_date}
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
                    id="calendar_end"
                    type="datetime-local"
                    placeholder="yyyy-MM-dd"
                    label={t.schedule.end_date}
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
                    text={form.id ? t.components.edit : t.components.save}
                  />
                </Vertical>
              </Wrapper>
            </React.Fragment>
          ) : (
            <Vertical internal={1} styles={{ overflow: "auto" }}>
              {selected?.map(function (schedule) {
                return (
                  <AgendaDate
                    key={schedule.id}
                    date={schedule.start}
                    description={schedule.description}
                    start={schedule.start}
                    end={schedule.end}
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
                  />
                );
              })}
            </Vertical>
          )}
        </Vertical>
      </Horizontal>
    </React.Fragment>
  );
};

export default SchedulesPanel;
