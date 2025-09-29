import {
  Plus,
  Trash,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { endOfDay, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

//apis
import apis from "../../../apis";

// assets
import {
  PurchaseStagesOptions,
  PurchaseStagesCategory,
} from "../../../assets/Purchase";

// utils
import Download from "../../../utils/Download";
import Calculate from "../../../utils/Calculate";
import Clipboard from "../../../utils/Clipboard";

// types
import {
  TypePurchase,
  TypePurchaseItem,
  TypePurchaseStage,
} from "../../../types/Purchases";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

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
import Stats from "../../../components/stats/Stats";
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

const PurchasesList = function () {
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
  const [purchaser, setPurchaser] = useState<string>("all");
  const [stats, setStats] = useState<Record<string, number>>({});
  const [purchases, setPurchases] = useState<TypePurchase[]>([]);
  const [stage, setStage] = useState<TypePurchaseStage | "all">("all");
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: subDays(new Date(), 30),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchPurchases = async function () {
    setLoading(true);
    try {
      const response = await apis.Purchase.list<
        ApiResponsePaginate<TypePurchase>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
          showDeleted: "true",
          filter: JSON.stringify({
            stage: stage !== "all" ? stage : undefined,
            $expr:
              purchaser !== "all"
                ? {
                    $eq: [{ $toString: "$purchaserId" }, purchaser],
                  }
                : undefined,
            $and: [
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
              {
                $or: searchDebounced
                  ? [
                      {
                        purchaseId: searchDebounced,
                      },
                      {
                        supplierName: {
                          $regex: searchDebounced,
                          $options: "i",
                        },
                      },
                    ]
                  : undefined,
              },
            ],
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
          "[src/pages/products/purchases/PurchasesList.tsx]",
          response.data,
        );
        return;
      }
      setPurchases(response.data.result.items);
      setTotal(response.data.result.pagination.total);

      if (!interval.start || !interval.end) return;

      const statsResponse = await apis.Purchase.stats<Record<string, number>>(
        token,
        instance.name,
        {
          dateStart: interval.start.toISOString(),
          dateEnd: interval.end.toISOString(),
        },
        workspaceId,
      );
      if (!statsResponse.data?.result) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }
      setStats(statsResponse.data.result);

      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/purchases/PurchasesList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch purchases
  useAsync(FetchPurchases, [
    interval,
    stage,
    workspaceId,
    page,
    purchaser,
    searchDebounced,
  ]);

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
          Download.JSON(data, `purchase-${data.id}.json`);
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
          navigate(`/f/purchases/inspect/${data.id}`);
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
              const response = await apis.Purchase.delete(
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
              await FetchPurchases();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error(
                "[src/pages/products/purchases/PurchasesList.tsx]",
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
                id: "purchases",
                label: t.purchase.purchases,
                url: "/f/purchases",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          animation
          loading={loading}
          Icon={ShoppingBagOpen}
          title={t.purchase.stats_quantity}
          value={stats.quantity || 0}
          valueUnit={t.purchase.purchases.toLowerCase()}
          footer={t.purchase.stats_quantity_description}
        />

        <Stats
          animation
          loading={loading}
          category="Success"
          Icon={ShoppingBagOpen}
          title={t.purchase.stats_successful}
          value={stats.purchasesSuccessful || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.purchase.stats_successful_description}
        />

        <Stats
          animation
          loading={loading}
          category="Warning"
          Icon={ShoppingBagOpen}
          title={t.purchase.stats_pending}
          value={stats.purchasesPending || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.purchase.stats_pending_description}
        />

        <Stats
          animation
          category="Danger"
          loading={loading}
          Icon={ShoppingBagOpen}
          title={t.purchase.stats_unsuccessful}
          value={stats.purchasesUnsuccessful || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.purchase.stats_unsuccessful_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.purchase.new}
          onClick={() => navigate("/f/purchases/inspect")}
        />
        <div style={{ maxWidth: 160 }}>
          <InputSelect
            label=""
            value={stage}
            empty={t.sale.all_stage}
            options={[...PurchaseStagesOptions, "all"].map(function (stage) {
              if (stage === "all")
                return {
                  id: stage,
                  value: stage,
                  text: t.purchase.all_stage,
                };
              return {
                id: stage,
                value: stage,
                text: t.purchase[stage as keyof typeof t.purchase],
              };
            })}
            onChange={function (event) {
              const newStage =
                (event.currentTarget?.value as TypePurchaseStage) || "";
              setStage(newStage);
              return;
            }}
          />
        </div>
        <div style={{ maxWidth: 256 }}>
          <InputSelect
            label=""
            value={purchaser}
            empty={t.purchase.purchaser}
            options={[
              { id: "all", name: t.purchase.all_purchaser, status: true },
              ...users,
            ].map(function (userLocal) {
              return {
                id: userLocal.id,
                value: userLocal.id,
                text: userLocal.name,
                disabled: !userLocal.status,
              };
            })}
            onChange={function (event) {
              const newSeller = event.currentTarget?.value || "";
              setPurchaser(newSeller);
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
            const data = purchases.filter(function (purchase) {
              return selected.includes(purchase.id);
            });
            Download.JSON(data, `purchases.json`);
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
          data={purchases as TableData[]}
          columns={{
            purchaseId: {
              label: t.purchase.id,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={(data?.purchaseId as string) || ""}
                  />
                );
              },
            },
            stage: {
              label: t.purchase.stage,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.purchase?.[data.stage as keyof typeof t.purchase] ||
                      t.components.unknown
                    }
                    category={
                      PurchaseStagesCategory?.[
                        data.stage as TypePurchaseStage
                      ] || "Neutral"
                    }
                  />
                );
              },
            },
            supplierName: {
              label: t.purchase.supplier,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/purchases/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.supplierName as string}
                  </div>
                );
              },
            },
            itemName: {
              label: t.purchase.items,
              handler: function (data) {
                const itemsNamesFrequency = (
                  data?.items as TypePurchaseItem[]
                ).reduce(
                  function (acc, item) {
                    acc[item.itemName] =
                      (acc[item.itemName] || 0) + item.quantity;
                    return acc;
                  },
                  {} as Record<string, number>,
                );

                return (
                  <div>
                    {Object.entries(itemsNamesFrequency)?.map(function (
                      [itemName, value],
                      index,
                    ) {
                      return (
                        <div key={`item-name-${index}`}>
                          {String(value)}x {itemName}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            details: {
              label: t.purchase.details,
              handler: function (data) {
                const {
                  subtotalDeductions,
                  subtotalAdditions,
                  subtotalShipping,
                } = Calculate.totalPurchase(data as TypePurchase);

                return (
                  <Vertical
                    internal={0.4}
                    styles={{ alignItems: "flex-start" }}
                  >
                    {!subtotalAdditions &&
                      !subtotalDeductions &&
                      !subtotalShipping && (
                        <i style={{ opacity: 0.6 }}>
                          {t.purchase.empty_details}
                        </i>
                      )}
                    {Boolean(subtotalShipping) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.purchase.shipping}: +${Currency(subtotalShipping)}`}
                      />
                    )}
                    {Boolean(subtotalAdditions) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.purchase.addition}: +${Currency(subtotalAdditions)}`}
                      />
                    )}
                    {Boolean(subtotalDeductions) && (
                      <Badge
                        category="Success"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.purchase.deduction}: +${Currency(subtotalDeductions)}`}
                      />
                    )}
                  </Vertical>
                );
              },
            },
            total: {
              label: t.components.total,
              maxWidth: 128,
              handler: function (data) {
                const { total } = Calculate.totalPurchase(data as TypePurchase);
                return <div>{Currency(total || 0)}</div>;
              },
            },
            user: {
              label: t.purchase.purchaser,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                const purchaserFinded =
                  users?.find(function (user) {
                    return user.id === data.purchaserId;
                  }) || userFinded;
                return (
                  <Tooltip
                    content={
                      t.components[purchaserFinded?.role || "collaborator"]
                    }
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={purchaserFinded?.photo || ""}
                      description={purchaserFinded?.email || ""}
                      name={purchaserFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
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
          options={getOptions}
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

export default PurchasesList;
