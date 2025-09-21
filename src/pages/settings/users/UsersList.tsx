import {
  Plus,
  Trash,
  Newspaper,
  CopySimple,
  PencilSimple,
  QuestionMark,
  FolderSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfYear } from "date-fns";

//apis
import apis from "../../../apis";

// utils
import Clipboard from "../../../utils/Clipboard";
import PhoneNumber from "../../../utils/PhoneNumber";

// types
import { TypeUser } from "../../../types/User";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";
import usePermission from "../../../hooks/usePermission";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { Input, InputInterval } from "../../../components/inputs/Input";

const pageSize = 10;

const UsersList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { checkByPlan } = usePermission();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, token, instance, workspaces, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<TypeUser[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  // TODO: format document
  const FetchUsers = async function () {
    setLoading(true);
    try {
      const response = await apis.User.list<ApiResponsePaginate<TypeUser>>(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
          searchField: "name",
          search: searchDebounced,
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
        },
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn("[src/pages/settings/users/UsersList.tsx]", response.data);
        return;
      }
      setUsers(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/settings/users/UsersList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch users
  useAsync(FetchUsers, [interval, page, searchDebounced]);

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
                id: "users",
                label: t.user.users,
              },
            ]}
          />
        </h2>
      </Horizontal>

      {!checkByPlan("enterprise") && (
        <Callout
          Icon={FolderSimple}
          category="Warning"
          text={t.callout.plan_limit_users}
          styles={{ fontSize: "var(--textSmall)" }}
        />
      )}

      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.user.new}
          onClick={() => navigate("/f/users/inspect")}
        />
        <div style={{ minWidth: 200, maxWidth: 256 }}>
          <InputInterval
            label=""
            value={[interval.start, interval.end]}
            onChange={function (interval) {
              const [start, end] = interval;
              setInterval({
                start: start ? new Date(start) : null,
                end: end ? new Date(end) : null,
              });
              return;
            }}
          />
        </div>
        <Input
          label=""
          value={search}
          placeholder={t.components.search}
          onChange={function (event) {
            setSearch(event.currentTarget?.value || "");
            return;
          }}
        />
        <Tooltip content={t.components.help}>
          <Button
            text=""
            onlyIcon
            category="Neutral"
            Icon={QuestionMark}
            onClick={function () {
              OpenDialog({
                width: 700,
                category: "Success",
                title: t.components.help,
                cancelText: t.components.close,
                description: (
                  <iframe
                    height={400}
                    style={{ border: "none", width: "100%" }}
                    src="https://www.youtube.com/embed/L-yA7-puosA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                ),
              });
              return;
            }}
          />
        </Tooltip>
      </Horizontal>

      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          loading={loading}
          data={users as TableData[]}
          columns={{
            status: {
              label: t.components.status,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={String(data.status)}
                    options={[
                      {
                        id: "true",
                        value: "true",
                        label: t.components.active,
                      },
                      {
                        id: "false",
                        value: "false",
                        label: t.components.inactive,
                      },
                    ]}
                    onChange={async function (event) {
                      try {
                        if (data.id === user.id) {
                          play("alert");
                          toast.warning(t.toast.warning_error, {
                            description: t.user.not_change_status,
                          });
                          return;
                        }
                        const response = await apis.User.update(
                          token,
                          instance.name,
                          data.id,
                          {
                            status: event.currentTarget?.value === "true",
                          },
                        );
                        if (!response.data?.result || response.status !== 200) {
                          play("alert");
                          toast.warning(t.toast.warning_error, {
                            description: t.toast.warning_edit,
                          });
                          return;
                        }
                        play("ok");
                        toast.success(t.toast.success, {
                          description: t.toast.success_edit,
                        });
                        await FetchUsers();
                      } catch (err) {
                        play("alert");
                        toast.error(t.toast.warning_error, {
                          description: t.toast.error_edit,
                        });
                        console.error(
                          "[src/pages/settings/users/UsersList.tsx]",
                          err,
                        );
                      }
                      return;
                    }}
                  />
                );
              },
            },
            role: {
              label: t.user.role,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category="Info"
                    value={
                      t.components?.[data.role as keyof typeof t.components] ||
                      t.components.collaborator
                    }
                  />
                );
              },
            },
            name: {
              label: t.user.name,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/users/inspect/${data.id}`);
                      return;
                    }}
                  >
                    <Profile
                      photoCircle
                      photoSize={4}
                      padding={false}
                      name={data.name as string}
                      photo={(data.photo as string) ?? undefined}
                    />
                  </div>
                );
              },
            },
            document1: { label: t.user.document },
            mobile: {
              label: t.user.mobile,
              handler: function (data) {
                return (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`tel:${data.mobile as string}`}
                  >
                    {PhoneNumber.Internacional((data?.mobile as string) || "")}
                  </a>
                );
              },
            },
            email: {
              label: t.user.email,
              handler: function (data) {
                return (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`mailto:${data.email as string}`}
                  >
                    {(data?.email as string) || ""}
                  </a>
                );
              },
            },
            address: {
              label: t.user.address,
              handler: function (data) {
                return `${data?.addressStreet}, ${data?.addressNumber}, ${data?.addressCity} - ${data?.addressState}`;
              },
            },
            createdAt: {
              label: t.components.created_at,
              handler: function (data) {
                const datetime = instanceDateTime(data.createdAt as string);
                return datetime;
              },
            },
          }}
          selected={selected}
          setSelected={setSelected}
          options={[
            {
              id: "copy",
              Icon: CopySimple,
              label: t.components.copy_id,
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  const result = await Clipboard.copy(data.id as string);
                  if (result) {
                    play("ok");
                    toast.success(t.toast.success, {
                      description: t.toast.success_copy,
                    });
                    return;
                  }
                }
                play("alert");
                toast.warning(t.toast.warning_error, {
                  description: t.toast.warning_copy,
                });
                return;
              },
            },
            {
              id: "audit",
              Icon: Newspaper,
              label: t.user.to_audit,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/users/audit/${data.id}`);
                return;
              },
            },
            {
              id: "edit",
              Icon: PencilSimple,
              label: t.components.edit,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/users/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              Icon: Trash,
              label: t.components.delete,
              IconColor: "var(--dangerColor",
              styles: { color: "var(--dangerColor)" },
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (!data || typeof data !== "object" || !("id" in data))
                  return;
                OpenDialog({
                  category: "Danger",
                  title: t.dialog.title_delete,
                  description: t.dialog.description_delete,
                  confirmText: t.components.delete,
                  onConfirm: async function () {
                    try {
                      const response = await apis.User.delete(
                        token,
                        instance.name,
                        data.id as string,
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
                      await FetchUsers();
                      return;
                    } catch (err) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.toast.error_delete,
                      });
                      console.error(
                        "[src/pages/settings/users/UsersList.tsx]",
                        err,
                      );
                      return;
                    }
                  },
                });
              },
            },
          ]}
        />
        <Pagination
          display
          pageCurrent={page}
          setPage={setPage}
          itemsTotal={total}
          pageSize={pageSize}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default UsersList;
