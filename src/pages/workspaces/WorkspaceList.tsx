import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { format, subWeeks } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Plus, QuestionMark } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// types
import { TypeWorkspace } from "../../types/Workspace";
import { ApiResponsePaginate } from "../../types/Apis";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Badge from "../../components/badges/Badge";
import Button from "../../components/buttons/Button";
import Tooltip from "../../components/tooltips/Tooltip";
import { useDialog } from "../../components/dialogs/Dialog";
import Table, { TableData } from "../../components/tables/Table";
import Pagination from "../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../components/aligns/Align";
import { Input, InputInterval } from "../../components/inputs/Input";

const pageSize = 10;

const WorkspaceList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog, CloseDialog } = useDialog();
  const { token, instance, workspaceId, saveWorkspaces } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<TypeWorkspace[]>([]);

  const [searchDebounced] = useDebounce(search, 500);

  const today = format(new Date(), "yyyy-MM-dd");
  const lastWeek = format(subWeeks(new Date(), 1), "yyyy-MM-dd");

  const FetchWorkspace = async function () {
    if (!token || !instance) return;
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
      if (!response.data?.result?.items) return;
      setWorkspaces(response.data.result.items);
      saveWorkspaces(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      console.error("[src/pages/workspaces/WorkspaceList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch workspace
  useAsync(FetchWorkspace, [page, searchDebounced]);

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.workspace.workspaces}</h1>
      </Horizontal>
      <Horizontal internal={1} styles={{ justifyContent: "space-between" }}>
        <Horizontal internal={1}>
          <Button
            Icon={Plus}
            category="Success"
            text={t.workspace.new}
            onClick={() => navigate("/f/workspaces/inspect")}
          />
          <InputInterval label="" value={[lastWeek, today]} />
          <Input
            label=""
            value={search}
            placeholder={t.components.search}
            onChange={function (event) {
              setSearch(event.currentTarget?.value || "");
              return;
            }}
          />
        </Horizontal>
        <Horizontal internal={1}>
          <Button category="Neutral" text={t.components.import} />
          <Button category="Neutral" text={t.components.export} />
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
              id: "edit",
              label: t.components.edit,
              onClick: function (_: unknown, data: Record<string, unknown>) {
                if (data) navigate(`/f/workspaces/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              label: t.components.delete,
              onClick: async function (
                _: unknown,
                data: Record<string, unknown>,
              ) {
                if (!data) return;
                if (workspaceId === data.id) {
                  toast.error(t.workspace.not_delete);
                  return;
                }
                OpenDialog({
                  category: "Success",
                  title: t.dialog.title_delete,
                  description: t.dialog.description_delete,
                  confirmText: t.components.confirm,
                  onConfirm: async function () {
                    try {
                      const response = await apis.Workspace.delete(
                        token,
                        instance.name,
                        data.id as string,
                      );
                      if (!response.data?.result) {
                        toast.warning(t.toast.error_delete);
                        return;
                      }
                      toast.success(t.toast.success_delete);
                      CloseDialog();
                      await FetchWorkspace();
                      return;
                    } catch (err) {
                      toast.error(t.toast.error_delete);
                      console.error(
                        "[src/pages/workspaces/WorkspaceList.tsx]",
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
              label: "Status",
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={
                      data.status ? t.components.active : t.components.inactive
                    }
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
                const dateFormatted = format(
                  new Date(data.createdAt as string),
                  "dd/MM/yyyy HH:mm:ss",
                );
                return dateFormatted;
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
