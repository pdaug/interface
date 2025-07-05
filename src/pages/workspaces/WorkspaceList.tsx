import React, { useState } from "react";
import { format, subWeeks } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Plus, QuestionMark } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Badge from "../../components/badges/Badge";
import Button from "../../components/buttons/Button";
import { InputInterval } from "../../components/inputs/Input";
import Table, { TableData } from "../../components/tables/Table";
import Pagination from "../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../components/aligns/Align";

// types
import { TypeWorkspace } from "../../types/Workspace";
import { ApiResponsePaginate } from "../../types/Apis";

const WorkspaceList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { token, instance } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<TypeWorkspace[]>([]);

  const today = format(new Date(), "yyyy-MM-dd");
  const lastWeek = format(subWeeks(new Date(), 1), "yyyy-MM-dd");

  // fetch instance by subdomain
  useAsync(async function () {
    if (!token || !instance) return;
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
          onClick={() => navigate("/f/workspace/inspect")}
        />
        <div>
          <InputInterval label="" value={[lastWeek, today]} />
        </div>
        <div style={{ flex: 1 }}></div>
        <Button category="Neutral" text="Importar" />
        <Button category="Neutral" text="Exportar" />
        <Button category="Neutral" text="" Icon={QuestionMark} onlyIcon />
      </Horizontal>
      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          selected={selected}
          setSelected={setSelected}
          data={workspaces as TableData[]}
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
            category: { label: t.workspace.category },
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
