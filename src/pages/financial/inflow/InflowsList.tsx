import {
  Plus,
  Trash,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { endOfDay, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

//apis
import apis from "../../../apis";

// assets
import { FlowStagesCategory, FlowStagesOptions } from "../../../assets/Flow";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import { TypeAccount } from "../../../types/Account";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";
import { TypeFlow, TypeFlowStages } from "../../../types/Flow";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";
import usePermission from "../../../hooks/usePermission";

// components
import {
  Input,
  InputSelect,
  InputInterval,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const InflowsList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { renderByPlan } = usePermission();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [inflows, setInflows] = useState<TypeFlow[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);
  const [stages, setStages] = useState<TypeFlowStages | "all">("all");
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: subDays(new Date(), 30),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchInflows = async function () {
    setLoading(true);
    try {
      const response = await apis.Flow.list<ApiResponsePaginate<TypeFlow>>(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
          showDeleted: "true",
          filter: JSON.stringify({
            type: "inflow",
            stage: stages !== "all" ? stages : undefined,
            accountId: accountId !== "" ? accountId : undefined,
            paymentDate: {
              $gte: interval.start ? interval.start.toISOString() : undefined,
              $lt: interval.end ? interval.end.toISOString() : undefined,
            },
          }),
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/financial/inflow/InflowsList.tsx]",
          response.data,
        );
        return;
      }
      setInflows(response.data.result.items);
      setTotal(response.data.result.pagination.total);

      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/financial/inflow/InflowsList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch inflows
  useAsync(FetchInflows, [
    interval,
    stages,
    workspaceId,
    page,
    accountId,
    searchDebounced,
  ]);

  // fetch accounts
  useAsync(
    async function () {
      try {
        const response = await apis.Account.list<
          ApiResponsePaginate<TypeAccount>
        >(
          token,
          instance.name,
          {
            pageSize: 999,
            pageCurrent: 1,
            orderField: "createdAt",
            orderSort: "asc",
          },
          workspaceId,
        );
        if (!response.data?.result?.items) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
        }
        setAccounts(response.data.result.items);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/financial/inflow/InflowsList.tsx]", err);
      }
      return;
    },
    [workspaceId],
  );

  const getOptions = [
    {
      id: "copy",
      label: t.components.copy_id,
      Icon: CopySimple,
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
      label: t.components.download,
      Icon: DownloadSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          Download.JSON(data, `inflow-${data.id}.json`);
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
      label: t.components.edit,
      Icon: PencilSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data)
          navigate(`/f/inflows/inspect/${data.id}`);
        return;
      },
    },
    {
      id: "delete",
      label: t.components.delete,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (!data || typeof data !== "object" || !("id" in data)) return;
        OpenDialog({
          category: "Danger",
          title: t.dialog.title_delete,
          description: t.dialog.description_delete,
          confirmText: t.components.delete,
          onConfirm: async function () {
            try {
              const response = await apis.Flow.delete(
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
              await FetchInflows();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error(
                "[src/pages/financial/inflow/InflowsList.tsx]",
                err,
              );
              return;
            }
          },
        });
      },
    },
  ];

  return renderByPlan(
    "advanced",
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
                id: "inflows",
                label: t.inflow.inflows,
                url: "/f/inflows",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.inflow.new}
          onClick={() => navigate("/f/inflows/inspect")}
        />
        <div style={{ maxWidth: 160 }}>
          <InputSelect
            label=""
            value={stages}
            empty={t.inflow.all_stages}
            options={[...FlowStagesOptions, "all"].map(function (stage) {
              if (stage === "all")
                return {
                  id: stage,
                  value: stage,
                  text: t.inflow.all_stages,
                };
              return {
                id: stage,
                value: stage,
                text:
                  t.inflow?.[stage as keyof typeof t.inflow] ||
                  t.components.unknown,
              };
            })}
            onChange={function (event) {
              const newStage =
                (event.currentTarget?.value as TypeFlowStages) || "";
              setStages(newStage);
              return;
            }}
          />
        </div>
        <div style={{ maxWidth: 256 }}>
          <InputSelect
            label=""
            value={accountId}
            empty={t.account.account}
            options={[
              { id: "", name: t.inflow.all_accounts, status: true },
              ...accounts,
            ].map(function (userLocal) {
              return {
                id: userLocal.id,
                value: userLocal.id,
                text: userLocal.name,
                disabled: !userLocal.status,
              };
            })}
            onChange={function (event) {
              const newAccountId = event.currentTarget?.value || "";
              setAccountId(newAccountId);
              return;
            }}
          />
        </div>
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
        <Button
          category="Neutral"
          disabled={!selected.length}
          text={t.components.export}
          onClick={function () {
            const data = inflows.filter(function (inflow) {
              return selected.includes(inflow.id);
            });
            Download.JSON(data, `inflows.json`);
            play("ok");
            toast.success(t.toast.success, {
              description: t.toast.success_download,
            });
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
                    src="https://www.youtube.com/embed/mx5WGJPhfvA?si=mB9xElXB9CjheQjp"
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
          data={inflows as TableData[]}
          selected={selected}
          setSelected={setSelected}
          options={getOptions}
          columns={{
            stage: {
              label: t.inflow.stages,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.inflow?.[data.stage as keyof typeof t.inflow] ||
                      t.components.unknown
                    }
                    category={
                      FlowStagesCategory?.[data.stage as TypeFlowStages] ||
                      "Neutral"
                    }
                  />
                );
              },
            },
            paymentMethod: {
              label: t.inflow.payment_method,
              maxWidth: 140,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      t.inflow[data.paymentMethod as keyof typeof t.inflow] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            name: {
              label: t.inflow.name,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/inflows/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.name as string}
                  </div>
                );
              },
            },
            accountId: {
              label: t.account.account,
              maxWidth: 160,
              handler: function (data) {
                const accountFinded = accounts?.find(function (account) {
                  return account.id === data.accountId;
                });
                return <div>{accountFinded?.name as string}</div>;
              },
            },
            paymentValue: {
              label: t.inflow.payment_value,
              handler: function (data) {
                return (
                  <div>
                    {data.paymentInstallments &&
                    Number(data.paymentInstallments) > 0 ? (
                      <div>
                        <span>
                          {data.paymentInstallments as number}x{" "}
                          {t.components.of}{" "}
                        </span>
                        <span>
                          {Currency(
                            parseFloat(data.paymentValue as string) /
                              parseFloat(data.paymentInstallments as string),
                          )}
                        </span>
                      </div>
                    ) : (
                      <div>{Currency(data.paymentValue as number)}</div>
                    )}
                  </div>
                );
              },
            },
            user: {
              label: t.components.user,
              maxWidth: 180,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                return (
                  <Tooltip
                    content={t.components[userFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
              },
            },
            paymentDate: {
              label: t.inflow.payment_date,
              maxWidth: 160,
              handler: function (data) {
                const datetime = instanceDateTime(data.paymentDate as string);
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
    </React.Fragment>,
  );
};

export default InflowsList;
