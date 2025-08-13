import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Pencil } from "@phosphor-icons/react";
import { endOfDay, format, isSameDay, startOfDay, subDays } from "date-fns";

// apis
import apis from "../../../apis";

// assets
import {
  ScheduleCategoriesOptions,
  SchedulePrioritiesOptions,
} from "../../../assets/Schedules";

// types
import {
  TypeSchedule,
  TypeScheduleCategory,
  TypeSchedulePriority,
} from "../../../types/Schedules";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useSchema from "../../../hooks/useSchema";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Agenda, AgendaDate } from "../../../components/Agendas/Agenda";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Profile from "../../../components/profiles/Profile";

const SchedulesPanel = function () {
  const t = useTranslate();
  const play = useSounds();
  const Schema = useSchema();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, users, token, instance, workspaceId, workspaces } = useSystem();

  const initialForm: TypeSchedule = {
    id: "",
    title: "",
    category: "note",
    priority: "none",
    description: "",
    start: startOfDay(new Date()),
    end: new Date(),
    userId: user.id,
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<TypeSchedule>(initialForm);
  const [selected, setSelected] = useState<TypeSchedule[]>([]);
  const [schedules, setSchedules] = useState<TypeSchedule[]>([]);

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  const FetchSchedules = async function () {
    setLoading(true);
    try {
      const response = await apis.Schedule.list<
        ApiResponsePaginate<TypeSchedule>
      >(
        token,
        instance.name,
        {
          pageSize: 999,
          pageCurrent: 1,
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/tool/schedules/SchedulesPanel.tsx]",
          response.data,
        );
        return;
      }
      const parse = response.data.result.items?.map(function (item) {
        return {
          ...item,
          start: new Date(item.start),
          end: item?.end ? new Date(item.end) : null,
        };
      });
      setSchedules(parse as TypeSchedule[]);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/tool/schedules/SchedulesPanel.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  const DeleteAction = async function (data: TypeSchedule) {
    OpenDialog({
      category: "Danger",
      title: t.dialog.title_delete,
      description: t.dialog.description_delete,
      confirmText: t.components.delete,
      onConfirm: async function () {
        try {
          const response = await apis.Schedule.delete(
            token,
            instance.name,
            data.id as string,
            workspaceId,
          );
          if (!response.data?.result) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.toast.error_delete,
            });
            return;
          }
          play("ok");
          toast.success(t.toast.success, {
            description: t.toast.success_delete,
          });
          CloseDialog();
          await FetchSchedules();
          return;
        } catch (err) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.toast.error_delete,
          });
          console.error("[src/pages/tool/schedules/SchedulesPanel.tsx]", err);
          return;
        }
      },
    });
    return;
  };

  // fetch schedules
  useAsync(FetchSchedules, [workspaceId]);

  const OnSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    try {
      // is editing
      if (form.id) {
        const response = await apis.Schedule.update(
          token,
          instance.name,
          form.id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          setLoading(false);
          toast.dismiss(toastId);
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.dismiss(toastId);
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        await FetchSchedules();
        setLoading(false);
        return;
      }
      // is creating
      const response = await apis.Schedule.create<TypeSchedule>(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        setLoading(false);
        return;
      }
      play("ok");
      toast.dismiss(toastId);
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      await FetchSchedules();
      setLoading(false);
      return;
    } catch (err) {
      setLoading(false);
      play("alert");
      toast.dismiss(toastId);
      console.error("[src/pages/tool/schedules/SchedulesPanel.tsx]", err);
      if (
        err instanceof AxiosError &&
        err.response?.data?.result?.message === "schema_incorrect"
      ) {
        Schema(err.response.data.result.err);
        return;
      }
      toast.error(t.toast.warning_error, {
        description: form.id ? t.toast.error_edit : t.toast.error_create,
      });
      return;
    }
  };

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
            <form
              className="flex"
              onSubmit={OnSubmit}
              style={{ flexDirection: "column", gap: "1rem" }}
            >
              <AgendaDate
                priority={form.priority}
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
                    disabled={loading}
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
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                  <Profile
                    photoCircle
                    padding={false}
                    photo={userFinded?.photo || ""}
                    description={userFinded?.email || ""}
                    name={userFinded?.name || t.components.unknown}
                  />
                  <Horizontal internal={1}>
                    <Button
                      type="submit"
                      IconSize={16}
                      className="flex1"
                      disabled={loading}
                      Icon={form.id ? Pencil : undefined}
                      category={form.id ? "Neutral" : "Success"}
                      text={form.id ? t.components.edit : t.components.save}
                    />
                    {form.id && (
                      <Button
                        type="button"
                        disabled={loading}
                        category="Danger"
                        text={t.components.remove}
                        onClick={() => DeleteAction(form)}
                      />
                    )}
                  </Horizontal>
                </Vertical>
              </Wrapper>
            </form>
          ) : (
            <Vertical internal={1} styles={{ overflow: "auto" }}>
              {selected?.map(function (schedule) {
                return (
                  <div
                    key={schedule.id}
                    style={{ cursor: "pointer" }}
                    onClick={function () {
                      setForm(schedule);
                      setSelected([]);
                      return;
                    }}
                  >
                    <AgendaDate
                      date={schedule.start}
                      priority={schedule.priority}
                      description={schedule.description}
                      start={schedule.start}
                      end={schedule.end}
                      title={schedule.title}
                    />
                  </div>
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
