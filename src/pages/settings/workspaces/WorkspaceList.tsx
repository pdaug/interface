import {
  Trash,
  Plus,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

// apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import { TypeWorkspace } from "../../../types/Workspace";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const WorkspaceList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { token, instance, workspaceId, saveWorkspaces } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<TypeWorkspace[]>([]);

  const [searchDebounced] = useDebounce(search, 500);

  const FetchWorkspaces = async function () {
    setLoading(true);
    try {
      const response = await apis.Workspace.list<
        ApiResponsePaginate<TypeWorkspace>
      >(token, instance.name, {
        pageSize,
        pageCurrent: page,
        searchField: "name",
        search: searchDebounced,
      });
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/settings/workspaces/WorkspaceList.tsx]",
          response.data,
        );
        return;
      }
      setWorkspaces(response.data.result.items);
      saveWorkspaces(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/settings/workspaces/WorkspaceList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch workspace
  useAsync(FetchWorkspaces, [page, searchDebounced]);

  return (
    <React.Fragment>
      <Horizontal>
        <h2>{t.workspace.workspaces}</h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.workspace.new}
          onClick={() => navigate("/f/workspaces/inspect")}
        />
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

      <Vertical internal={1}>
        <Table
          border
          loading={loading}
          selected={selected}
          setSelected={setSelected}
          data={workspaces as TableData[]}
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
              id: "download",
              Icon: DownloadSimple,
              label: t.components.download,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  Download.JSON(data, `workspace-${data.id}.json`);
                  play("ok");
                  toast.success(t.toast.success, {
                    description: t.toast.success_download,
                  });
                }
                return;
              },
            },
            {
              id: "edit",
              Icon: PencilSimple,
              label: t.components.edit,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/workspaces/inspect/${data.id}`);
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
                if (workspaceId === data.id) {
                  play("alert");
                  toast.error(t.toast.warning_error, {
                    description: t.workspace.not_delete,
                  });
                  return;
                }
                OpenDialog({
                  category: "Danger",
                  title: t.dialog.title_delete,
                  description: t.dialog.description_delete,
                  confirmText: t.components.delete,
                  onConfirm: async function () {
                    try {
                      const response = await apis.Workspace.delete(
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
                      await FetchWorkspaces();
                      return;
                    } catch (err) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.toast.error_delete,
                      });
                      console.error(
                        "[src/pages/settings/workspaces/WorkspaceList.tsx]",
                        err,
                      );
                      return;
                    }
                  },
                });
              },
            },
          ]}
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
                      if (workspaceId === data.id) {
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.workspace.not_change_status,
                        });
                        return;
                      }
                      try {
                        const response = await apis.Workspace.update(
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
                        await FetchWorkspaces();
                      } catch (err) {
                        play("alert");
                        toast.error(t.toast.warning_error, {
                          description: t.toast.error_edit,
                        });
                        console.error(
                          "[src/pages/settings/workspaces/WorkspaceList.tsx]",
                          err,
                        );
                      }
                      return;
                    }}
                  />
                );
              },
            },
            name: { label: t.workspace.name },
            description: {
              label: t.components.description,
              handler: function (data) {
                if (data.description) return data.description as string;
                return (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.stacks.no_description}
                  </i>
                );
              },
            },
            category: {
              label: t.components.category,
              handler: function (data) {
                const categoryTranslated =
                  t.workspace[data.category as keyof typeof t.workspace];
                return categoryTranslated;
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

export default WorkspaceList;
