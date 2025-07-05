import React, { useState } from "react";
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
import { useDialog } from "../../components/dialogs/Dialog";
import { InputInterval } from "../../components/inputs/Input";
import Table, { TableData } from "../../components/tables/Table";
import Pagination from "../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const WorkspaceList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();
  const { token, instance } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<TypeWorkspace[]>([]);

  const today = format(new Date(), "yyyy-MM-dd");
  const lastWeek = format(subWeeks(new Date(), 1), "yyyy-MM-dd");

  // fetch instance by subdomain
  useAsync(async function () {
    if (!token || !instance) return;
    setLoading(true);
    try {
      const response = await apis.Workspace.list<
        ApiResponsePaginate<TypeWorkspace>
      >(token, instance.name);
      if (!response.data?.result?.items) return;
      setWorkspaces(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      console.error("[src/pages/workspaces/WorkspaceList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.workspace.workspaces}</h1>
      </Horizontal>
      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.workspace.new}
          onClick={() => navigate("/f/workspaces/inspect")}
        />
        <div>
          <InputInterval label="" value={[lastWeek, today]} />
        </div>
        <div style={{ flex: 1 }}></div>
        <Button category="Neutral" text="Importar" />
        <Button category="Neutral" text="Exportar" />

        <Button
          text=""
          onlyIcon
          category="Neutral"
          Icon={QuestionMark}
          onClick={function () {
            OpenDialog({
              category: "Success",
              title: "eae",
              description: "oi",
            });
            return;
          }}
        />
      </Horizontal>
      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          loading={loading}
          selected={selected}
          setSelected={setSelected}
          data={workspaces as TableData[]}
          options={[
            {
              id: "edit",
              label: "edit",
              onClick: function (_, data) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/workspaces/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              label: "delete",
              onClick: function (_, data) {
                console.log(data);
                return;
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
                      data.status ? t.workspace.active : t.workspace.inactive
                    }
                  />
                );
              },
            },
            name: { label: t.workspace.name },
            description: { label: t.workspace.description },
            category: {
              label: t.workspace.category,
              handler: function (data) {
                const categoryTranslated =
                  t.workspace[data.category as keyof typeof t.workspace];
                return categoryTranslated;
              },
            },
            createdAt: {
              label: t.workspace.created_at,
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
          pageSize={10}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default WorkspaceList;
