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

//apis
import apis from "../../../apis";

// utils
import Clipboard from "../../../utils/Clipboard";
import Formatter from "../../../utils/Formatter";
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
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { Input, InputInterval } from "../../../components/inputs/Input";

const pageSize = 10;

const UsersList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, token, instance } = useSystem();
  const { OpenDialog, CloseDialog } = useDialog();
  const { checkByPlan, checkByRole } = usePermission();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<TypeUser[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: null,
    end: null,
  });

  const [searchDebounced] = useDebounce(search, 500);

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

  const getOptions = [
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
      hidden: !checkByRole("admin"),
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
      hidden: function (data: unknown) {
        return (
          Boolean(
            data &&
              typeof data === "object" &&
              "id" in data &&
              data.id !== user.id,
          ) && !checkByRole("admin")
        );
      },
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
      hidden: !checkByRole("admin"),
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (!data || typeof data !== "object" || !("id" in data)) return;
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
              console.error("[src/pages/settings/users/UsersList.tsx]", err);
              return;
            }
          },
        });
      },
    },
  ];

  return (
    <React.Fragment>
      <Horizontal>
        <h2>{t.user.users}</h2>
      </Horizontal>

      {!checkByPlan("professional") && (
        <Callout
          Icon={FolderSimple}
          category="Warning"
          text={t.callout.plan_limit_users}
          styles={{ fontSize: "var(--textSmall)" }}
        />
      )}

      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        {checkByRole("admin") && (
          <Button
            Icon={Plus}
            category="Success"
            text={t.user.new}
            onClick={() => navigate("/f/users/inspect")}
          />
        )}
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
          noSelect
          selected={[user.id]}
          loading={loading}
          options={getOptions}
          data={
            users.sort((a, b) => {
              if (a.id === user.id) return -1;
              if (b.id === user.id) return 1;
              return 0;
            }) as TableData[]
          }
          columns={{
            status: {
              label: t.components.status,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={
                      !checkByRole("admin")
                        ? data.status
                          ? t.components.active
                          : t.components.inactive
                        : String(data.status)
                    }
                    options={
                      !checkByRole("admin")
                        ? undefined
                        : [
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
                          ]
                    }
                    onChange={
                      !checkByRole("admin")
                        ? undefined
                        : async function (event) {
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
                              if (
                                !response.data?.result ||
                                response.status !== 200
                              ) {
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
                          }
                    }
                  />
                );
              },
            },
            role: {
              label: t.user.role,
              maxWidth: "128px",
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
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
                    className={
                      user.id === data.id || checkByRole("admin")
                        ? "cursor"
                        : ""
                    }
                    onClick={function () {
                      if (user.id !== data.id && !checkByRole("admin")) return;
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
            document1: {
              label: t.user.document,
              handler: function (data) {
                return Formatter.document1(data.document1 as string);
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
